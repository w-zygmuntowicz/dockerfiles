# syntax=docker/dockerfile:1.2

# License: Apache-2.0

FROM ubuntu:22.04

# Qt version
ARG QT_MAJOR=6
ARG QT_MINOR=5
ARG QT_MICRO=3

# Qt installer version
ARG QT_INSTALLER_MAJOR=4
ARG QT_INSTALLER_MINOR=6
ARG QT_INSTALLER_MICRO=1

# Qt packages to install
#
# Note: available components can be listed by invoking Qt installer with `search` option, prefix is added automatically based on Qt
# version.
ARG QT_BIN_PACKAGE=gcc_64
ARG QT_PACKAGES="addons.qtserialport,addons.qtserialbus,addons.qtscxml,${QT_BIN_PACKAGE}"

# Arguments below typically do not need to be modified as they are deduced from previous ones.
ARG QT_VERSION="${QT_MAJOR}.${QT_MINOR}.${QT_MICRO}"
ARG QT_INSTALLER_FILE="qt-unified-linux-x64-${QT_INSTALLER_MAJOR}.${QT_INSTALLER_MINOR}.${QT_INSTALLER_MICRO}-online.run"
ARG QT_INSTALLER_PATH="/tmp/qt/${QT_INSTALLER_FILE}"
ARG QT_URL="https://ftp.fau.de/qtproject/archive/online_installers/${QT_INSTALLER_MAJOR}.${QT_INSTALLER_MINOR}/${QT_INSTALLER_FILE}"

# Environmental variables
ENV TZ=Europe/Warsaw
ENV QT_PATH=/opt/Qt
ENV QT_DESKTOP ${QT_PATH}/${QT_VERSION}/${QT_BIN_PACKAGE}
ENV PATH $QT_DESKTOP/bin:$PATH

# Configure timezone
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Basic tools
RUN apt-get update
RUN apt-get install curl git openssh-server sed sudo wget --yes

# Qt basic requirements (https://doc.qt.io/qt-5/linux.html)
RUN apt-get install build-essential libgl1-mesa-dev --yes

# Clang
RUN apt-get install clang --yes

# Xvfb is needed to run GUI tests on a headless system
RUN apt-get install xvfb --yes

# Qbs
RUN apt-get install qbs --yes

# Download Qt installer
RUN mkdir -p /tmp/qt
RUN curl -fLs -o $QT_INSTALLER_PATH $QT_URL

# Download and install Qt
COPY _helpers/controller-qt-online-"${QT_INSTALLER_MAJOR}"."${QT_INSTALLER_MINOR}".js /tmp/qt/controller.js
RUN chmod a+x $QT_INSTALLER_PATH
RUN --mount=type=secret,id=qtaccount . /run/secrets/qtaccount && QT_PACKAGES_PREFIX=qt.qt${QT_MAJOR}.$(echo "${QT_VERSION}" | tr -d .) QT_PACKAGES=${QT_PACKAGES} QT_QPA_PLATFORM=minimal $QT_INSTALLER_PATH -d --script /tmp/qt/controller.js
RUN unset QT_USER && unset QT_PASSWORD

# Clean
RUN find "${QT_PATH}" -mindepth 1 -maxdepth 1 ! -name "${QT_VERSION}" -exec echo 'Cleaning Qt SDK: {}' \; -exec rm -r '{}' \;
RUN rm -rf /tmp/qt
RUN rm ~/.local/share/Qt/qtaccount.ini

# Add group & user + sudo
RUN useradd -m user
RUN echo "user ALL=NOPASSWD: ALL" > /etc/sudoers.d/user

USER user
WORKDIR /home/user
ENV HOME /home/user

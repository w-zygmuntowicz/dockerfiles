# License: Apache-2.0

FROM ubuntu:19.04

ARG QT_VERSION=5.13.1
ARG QT_INSTALLER_FILE=qt-opensource-linux-x64-${QT_VERSION}.run
ARG QT_INSTALLER_PATH="/tmp/qt/${QT_INSTALLER_FILE}"
ARG QT_URL="https://ftp.fau.de/qtproject/archive/qt/__QT_MAJMIN__/${QT_VERSION}/${QT_INSTALLER_FILE}"
ARG QT_SHA256="0cd82c80287a783bd5db1339b6184803d57517c9450ffe16f505254853f0a41f"
ARG QT_MD5="21c3b16f851697fa8da8009f73694373"
ARG QT_SUM_FILE="/tmp/qt/sum.txt"

ENV QT_PATH=/opt/Qt
ENV QT_BIN_PACKAGE=gcc_64
ENV QT_DESKTOP ${QT_PATH}/${QT_VERSION}/${QT_BIN_PACKAGE}
ENV PATH $QT_DESKTOP/bin:$PATH

# Older releases of Ubuntu are moved to archive server
RUN sed -i -re 's/([a-z]{2}\.)?archive.ubuntu.com|security.ubuntu.com/old-releases.ubuntu.com/g' /etc/apt/sources.list
RUN apt-get update
RUN apt-get dist-upgrade --yes

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

# Download Qt toolchains
RUN mkdir -p /tmp/qt
RUN echo "${QT_MD5} ${QT_INSTALLER_PATH}" > $QT_SUM_FILE
RUN curl -fLs -o $QT_INSTALLER_PATH $(echo $QT_URL | sed "s/__QT_MAJMIN__/$(echo $QT_VERSION | cut -d. -f 1-2)/g")
RUN md5sum -c $QT_SUM_FILE

# Unpack Qt toolchains & clean
COPY _helpers/controller-qt-5.13.1.js /tmp/qt/controller.js
RUN chmod a+x $QT_INSTALLER_PATH
RUN --mount=type=secret,id=qtaccount . /run/secrets/qtaccount && QT_PACKAGES=qt.qt5.$(echo "${QT_VERSION}" | tr -d .).${QT_BIN_PACKAGE} QT_QPA_PLATFORM=minimal $QT_INSTALLER_PATH -v --script /tmp/qt/controller.js

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

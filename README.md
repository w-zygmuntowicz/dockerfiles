# Dockerfiles

Distributions with preinstalled Qt.

## Building images

Newer Dockerfiles from this repository can be used by invoking `docker build` from project root directory. A typical command looks
like this:

```
docker build --build-arg QT_USER=<user> --build-arg QT_PASSWORD=<password> . -f <Distro-Version_Qt-Version>/Dockerfile -t <docker-tag>
```

Use Docker Hub tag format `<hub-user>/<repo-name>[:<tag>]` for `<docker-tag>` to be able to push images to Docker Hub by it.

```
docker push <docker-tag>
```

## Qt installer scripting API

You can use provided JavaScript controller from [_helpers](_helpers) directory for headless install of Qt binaries.

First you must determine names of packages to install. Qt online installer
[search](https://doc.qt.io/qtinstallerframework/ifw-cli.html#summary-of-options)
command can help. For example following (Windows) installer command looks for available Qt 6.2.4 packagess:

```
./qt-unified-windows-x86-4.3.0-1-online.exe search qt.qt6.624
```

You need to provide account credentials and packages to the script through environmental variables. Package names are provided as
comma separated list in `QT_PACKAGES` variable. Value of `QT_PACKAGES_PREFIX` is prepended to every name listed in `QT_PACKAGES`.
Following command installs MSVC 2019 binaries along with Qt Serial Port module:

```
QT_USER=<user> QT_PASSWORD=<password> QT_PACKAGES_PREFIX=qt.qt6.624 QT_PACKAGES=addons.qtserialport,win64_msvc2019_64 ./qt-unified-windows-x86-4.3.0-1-online.exe -d --script qt-online-installer-controller.js
```


# Dockerfiles

Distributions with preinstalled Qt.

## Building images

Newer Dockerfiles from this repository can be used by invoking `docker build` from project root directory.

Create `../qtaccount.sh` file with Qt account credentials:

```
#!/bin/sh
QT_USER=<user>
QT_PASSWORD=<password>
```

A typical command looks like this:

```
docker build --secret id=qtaccount,src=../qtaccount.sh . -f <Distro-Version_Qt-Version>/Dockerfile -t <docker-tag>
```

Use Docker Hub tag format `<hub-user>/<repo-name>[:<tag>]` for `<docker-tag>` to be able to push images to Docker Hub by it.

```
docker push <docker-tag>
```

## Qt installer scripting API controller

You can use provided [JavaScript controller](_helpers/controller-qt-online-4.3.js) from [_helpers](_helpers) directory for headless
install of Qt binaries.

First this you must determine names of packages to install. Qt online installer [search](https://doc.qt.io/qtinstallerframework/ifw-cli.html#summary-of-commands)
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

Additionaly `QT_COMPANY` environmental variable can be used to inject the company name in Open Source Obligations page.

QPA plugin can be specified as usual with `QT_QPA_PLATFORM` environmental variable (e.g. `QT_QPA_PLATFORM=minimal`).

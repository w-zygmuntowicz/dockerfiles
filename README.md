# Dockerfiles

Distributions with preinstalled Qt.

## Building images

Newer Dockerfiles from this repository can be used by invoking `docker build` from project root directory. Paths given below are
relative to project root.

On Windows remember about Windows and Linux modes. In Docker Desktop right-click taksbar icon and use
"Switch to Windows containers..." or "Switch to Linux containers....".

### Linux

Create `../qtaccount.sh` file with Qt account credentials:

```
#!/bin/sh
export QT_USER=<user>
export QT_PASSWORD=<password>
```

Make sure that this file has Unix end line characters (`dos2unix` tool may be handy on Windows).

A typical build command looks like this:

```
DOCKER_BUILDKIT=1 docker build --secret id=qtaccount,src=../qtaccount.sh . -f <Distro-Version_Qt-Version>/Dockerfile -t <docker-tag>
```

Use Docker Hub tag format `<hub-user>/<repo-name>[:<tag>]` for `<docker-tag>` to be able to push images to Docker Hub by it.

```
docker push <docker-tag>
```

### Windows

Create `../qtaccount.ps1` file with Qt account credentials:

```
$env:QT_USER = '<user>'
$env:QT_PASSWORD = '<password>'
```

Download [Visual Studio BuildTools](https://docs.microsoft.com/en-us/visualstudio/releases/2019/history) and put the executable
in the same directory as the script (`../vs_BuildTools.exe`).

Windows bulds can not uses secrets, so credentials are provided through local HTTP server. Launch local HTTP server and
host `..` directory. This can be done easily with Python and `http.server` module. Open the terminal `cd` to `..` and simply run:

```
python -m http.server
```

Trigger Docker build:

```
DOCKER_BUILDKIT=0 docker build --build-arg LOCAL_HTTP_SERVER=http://<hostname>:<port> . -f <Win-Version-msvcVersion-arch_Qt-Version>/Dockerfile -t <docker-tag>
```

Replace <hostname> with valid hostname or IP address. Python's `http.server` uses <port> 8000 by default.


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

# syntax=docker/dockerfile:1.2
# escape=`

# License: Apache-2.0

FROM mcr.microsoft.com/windows:20H2-amd64

# Qt version
ARG QT_MAJOR=6
ARG QT_MINOR=2
ARG QT_MICRO=2

# Qt installer version
ARG QT_INSTALLER_MAJOR=4
ARG QT_INSTALLER_MINOR=3
ARG QT_INSTALLER_MICRO=0-1

# Qt packages to install
#
# Note: available components can be listed by invoking Qt installer with `search` option, prefix is added automatically based on Qt
# version.
ARG QT_BIN_PACKAGE=win64_msvc2019_64
ARG QT_PACKAGES="addons.qtserialport,addons.qtserialbus,${QT_BIN_PACKAGE}"

# Arguments below typically do not need to be modified as they are deduced from previous ones.
ARG QT_VERSION="${QT_MAJOR}.${QT_MINOR}.${QT_MICRO}"
ARG QT_INSTALLER_FILE="qt-unified-windows-x86-${QT_INSTALLER_MAJOR}.${QT_INSTALLER_MINOR}.${QT_INSTALLER_MICRO}-online.exe"
#ARG QT_INSTALLER_PATH="C:\temp\Qt\$env:QT_INSTALLER_FILE"
ARG QT_URL="https://ftp.fau.de/qtproject/archive/online_installers/${QT_INSTALLER_MAJOR}.${QT_INSTALLER_MINOR}/${QT_INSTALLER_FILE}"

# Local HTTP server (replace with valid host/ip address)
ARG LOCAL_HTTP_SERVER=http://172.29.176.1:8000
# Qt account credentials.
ARG QT_ACCOUNT_SCRIPT=qtaccount.ps1
# Visual Studio bootstrapper (download from MS)
ARG VS_BOOTSTRAPPER=vs_BuildTools.exe

ARG QT_ACCOUNT_URL="${LOCAL_HTTP_SERVER}/${QT_ACCOUNT_SCRIPT}"
ARG VS_BOOTSTRAPPER_URL="${LOCAL_HTTP_SERVER}/${VS_BOOTSTRAPPER}"

SHELL ["powershell"]

# Install MSVC
RUN mkdir C:\temp\VS
RUN -Command Invoke-WebRequest $env:VS_BOOTSTRAPPER_URL -O C:\temp\VS\vs_bootstrapper.exe
SHELL ["cmd", "/S", "/C"]
RUN start /w C:\temp\VS\vs_bootstrapper.exe --includeRecommended --quiet --wait --norestart --nocache `
        --installPath "C:\VS\BuildTools" `
        --add Microsoft.VisualStudio.Workload.VCTools `
        || IF "%ERRORLEVEL%"=="3010" EXIT 0
SHELL ["powershell"]

# Install Qt
COPY _helpers/controller-qt-online-"${QT_INSTALLER_MAJOR}"."${QT_INSTALLER_MINOR}".js /temp/Qt/controller.js
RUN -Command Invoke-WebRequest $env:QT_URL -O C:\temp\Qt\$env:QT_INSTALLER_FILE
RUN Set-ExecutionPolicy -ExecutionPolicy Unrestricted
RUN -Command Invoke-WebRequest $env:QT_ACCOUNT_URL -O C:\temp\qtaccount.ps1; `
    . C:\temp\qtaccount.ps1; `
    $env:QT_PACKAGES_PREFIX = -join('qt.qt', $env:QT_MAJOR, '.', $env:QT_MAJOR, $env:QT_MINOR, $env:QT_MICRO); `
    $env:QT_PATH = 'C:\Qt'; `
    & C:\temp\Qt\$env:QT_INSTALLER_FILE -d --script C:\temp\Qt\controller.js; `
    rm C:\temp\qtaccount.ps1; `
    rm C:\Users\$env:UserName\AppData\Roaming\Qt\qtaccount.ini

# Clean up
RUN rm C:\temp\Qt -r -fo
RUN rm C:\Qt\MaintenanceTool.*
RUN rm C:\Qt\Docs -r -fo
RUN Get-ChildItem -Path C:\Qt\Examples -Include * -File -Recurse | foreach { $_.Delete()}
RUN cmd.exe /c rd /s /q C:\Qt\Examples
RUN rm C:\temp\VS -r -fo

# Restore the default Windows shell for correct batch processing.
SHELL ["cmd", "/S", "/C"]
CMD ["C:\\VS\\BuildTools\\Common7\\Tools\\VsDevCmd.bat", "&&", "powershell.exe", "-NoLogo", "-ExecutionPolicy", "Bypass"]


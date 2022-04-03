#!/bin/sh -e
# QT-CI Project
# License: Apache-2.0
# https://github.com/benlau/qtci

if [ $# -lt 2 ];
then
    echo extract-qt-installer qt-installer qt-controller output_path
    exit -1
fi

INSTALLER=$1
SCRIPT=$2
OUTPUT=$3
PACKAGES=$QT_CI_PACKAGES

chmod u+x $INSTALLER
QT_QPA_PLATFORM=minimal $INSTALLER -v --script $SCRIPT

#!/bin/bash

WHEEZY="wheezy"
JESSIE="jessie"
STRETCH="stretch"
BUSTER="buster"
BULLSEYE="bullseye"
BOOKWORM="bookworm"
TRIXIE="trixie"
FORKY="forky"

SUPPORTED_VERSIONS="$WHEEZY $JESSIE $STRETCH $BUSTER $BULLSEYE $BOOKWORM $TRIXIE $FORKY"

version=$STRETCH
url=http://mirrors.aliyun.com/raspbian/raspbian/

## Backup Source List File
cp -f /etc/apt/sources.list /etc/apt/sources.list.bak

for ver in $SUPPORTED_VERSIONS;
do
  num=`grep "$ver" /etc/apt/sources.list | wc -l`
  if [ $num -ne 0 ]
  then
    version=$ver
  fi
done

# Add Ali Source
echo "deb ${url} ${version} main non-free contrib" > /etc/apt/sources.list
echo "deb-src ${url} ${version} main non-free contrib" >> /etc/apt/sources.list
mkdir -p /etc/apt/sources.list.d
echo "deb ${url} ${version} main ui" > /etc/apt/sources.list.d/ali.list

echo "+ Replace \`Ali Soucre\` Finished!"

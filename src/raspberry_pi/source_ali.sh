#!/bin/bash

version=stretch
url=http://mirrors.aliyun.com/raspbian/raspbian/

## Backup Source List File
cp -f /etc/apt/sources.list /etc/apt/sources.list.bak

for ver in stretch wheezy jessie buster bullseye;
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

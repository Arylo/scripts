#!/bin/bash

source ./setup/generateScript.sh

generateScript

mkdir -p /etc/cron
local CONTENT="${CRON} sh /app/script.sh"
echo "${CONTENT}" > /etc/cron/crontab

crontab /etc/cron/crontab

crond -f

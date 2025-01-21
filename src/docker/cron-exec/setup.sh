#!/bin/bash

mkdir -p /etc/cron

echo "#!/bin/bash" > /app/script.sh
echo "set -x" >> /app/script.sh
echo "${COMMAND}" >> /app/script.sh
chmod +x /app/script.sh

echo "Console file /app/script.sh"
echo "================================"
cat /app/script.sh
echo "================================"

CONTENT="${CRON} sh /app/script.sh"
echo "${CONTENT}" > /etc/cron/crontab

crontab /etc/cron/crontab

crond -f

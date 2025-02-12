ARG FROM_IMAGE="arylo/cron-exec"

FROM ${FROM_IMAGE}

# Per 5 min
ENV CRON="*/5 * * * *"
ENV COMMAND="sh /app/restart.sh"
ENV DOCKER_CONTAINER_NAME=''
ENV CHANGE_FILES=''

RUN apk add docker
RUN apk add openrc

ADD ./restart.sh /app/restart.sh
RUN chmod +x /app/restart.sh

ARG FROM_IMAGE

FROM ${FROM_IMAGE}

RUN apk add docker
RUN apk add openrc

ADD ./restart.sh /app/restart.sh
RUN chmod +x /app/restart.sh

ENV COMMAND="sh /app/restart.sh"

FROM alpine:3.9

ENV CRON="* * * * *"
ENV COMMAND="echo 'Hello World'"

RUN mkdir /etc/cron
ADD ./setup.sh /app/
RUN chmod +x /app/setup.sh

CMD ["sh", "/app/setup.sh"]

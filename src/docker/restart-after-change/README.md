# Cron job for restart the docker container while the watching file changes

## Description

In some scenarios, we only need to run some shell scripts periodically without requiring other complex operations and features.

## Environment

|Key|Type|Required|Description|
|--|--|--|--|
|DOCKER_SOCKET_FILE|Path|false|Default `/var/run/docker.sock`|
|DOCKER_CONTAINER_NAME|String|true||
|CHANGE_FILES|String|true||
|CRON|Cron|false|Specifies the schedule in [crontab](https://wikipedia.org/wiki/Cron) format, default `*/5 * * * *`|

## Sample

### Caddy

```shell
docker run -v /var/run/docker.sock:/var/run/docker.sock -e DOCKER_CONTAINER_NAME='caddy-1' -v /tmp/caddy.toml:/tmp/caddy.toml:ro -e CHANGE_FILES='/tmp/caddy.toml' arylo/restart-after-change:latest
```

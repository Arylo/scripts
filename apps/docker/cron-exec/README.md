# Cron job for execute shell script

## Description

In some scenarios, we only need to run some shell scripts periodically without requiring other complex operations and features.

## Environment

|Key|Type|Required|Description|
|--|--|--|--|
|CRON|Cron|true|Specifies the schedule in [crontab](https://wikipedia.org/wiki/Cron) format|
|COMMAND|String|false|The command line to be executed by the cron job|

## Sample

```shell
docker run -e CRON='30 * * * *' arylo/cron-exec:latest
```

#!/bin/bash

import ./generateScript.sh

function shouldGenerateScriptFile () {
  TARGET_PATH=/tmp/script.sh
  COMMAND="echo 'Hello World'"
  generateScript
}

function shouldGenerateSetupFile () {
  TARGET_PATH=/tmp/setup.sh
  COMMAND="cat /tmp/setup.sh"
  generateScript
}

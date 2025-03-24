#!/bin/bash

function HOOK_POST () {
  local targetPath=${TARGET_PATH:=/app/script.sh}
  echo "Console file ${targetPath}"
  echo "================================"
  cat ${targetPath}
  echo "================================"
}

function generateScript () {
  local targetPath=${TARGET_PATH:=/app/script.sh}
  echo "#!/bin/bash" > ${targetPath}
  echo "set -x" >> ${targetPath}
  echo "${COMMAND}" >> ${targetPath}
  chmod +x ${targetPath}

  HOOK_POST
}

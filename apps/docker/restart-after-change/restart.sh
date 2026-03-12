#!/bin/bash

# region General Check

function hasExist () {
  [[ $1 -ne 0 ]] && echo 'Exist' || echo 'Not Found'
}

DOCKER_SOCKET_FILE=/var/run/docker.sock

HAS_DOCKER_SOCKET=0
if [ -x ${DOCKER_SOCKET_FILE} ]; then
  HAS_DOCKER_SOCKET=1
fi
HAS_DOCKER_CONTAINER=0
if [ ${HAS_DOCKER_SOCKET} -ne 0 ]; then
  if [ ! -z ${DOCKER_CONTAINER_NAME} ]; then
    docker inspect ${DOCKER_CONTAINER_NAME} -f '{{.Name}}' > /dev/null
    if [ $? -eq 0 ] ;then
      HAS_DOCKER_CONTAINER=1
    fi
  fi
fi
HAS_HASH_PROGRESS=$(ls $(which sha256sum) | wc -l)

cat <<EOF
[[Docker Socket]]
  Path:   ${DOCKER_SOCKET_FILE}
  Status: $(hasExist ${HAS_DOCKER_SOCKET})
[[Target Docker Container]]
  Name:   ${DOCKER_CONTAINER_NAME}
  Status: $(hasExist ${HAS_DOCKER_CONTAINER})
[[Hash Program]]
  Path:   $(which sha256sum)
  Status: $(hasExist ${HAS_HASH_PROGRESS})
EOF

if [[ ${HAS_DOCKER_SOCKET} -eq 0 || ${HAS_HASH_PROGRESS} -eq 0 || ${HAS_DOCKER_CONTAINER} -eq 0 ]]; then
  echo "Required components are missing. Exiting..."
  exit 1
fi

# endregion General Check

# region Files Check

STORE_PATH=/tmp
CHECK_FILES=(${CHANGE_FILES})
CHECK_FILES_COUNT=${#CHECK_FILES[@]}

LAST_HASH=()
CUR_HASH=()
HAS_CHANGE=0

for (( i=0; i<${CHECK_FILES_COUNT}; i++ )) do
  if [[ -f "${STORE_PATH}/${i}.hash" ]]; then
    LAST_HASH[i]=$(cat "${STORE_PATH}/${i}.hash")
  else
    LAST_HASH[i]=''
  fi
  hash=$(sha256sum ${CHECK_FILES[i]})
  hash=${hash:0:64}
  CUR_HASH[i]=${hash}
  echo "${hash}" > "${STORE_PATH}/${i}.hash"
done

for (( i=0; i<${CHECK_FILES_COUNT}; i++ )) do
  if [[ "${LAST_HASH[i]}" != "${CUR_HASH[i]}" ]]; then
    HAS_CHANGE=1
    break
  fi
done

cat <<EOF
[[Change files]]
  Count:  ${CHECK_FILES_COUNT}
EOF
for (( i=0; i<${CHECK_FILES_COUNT}; i++ )) do
cat <<EOF
  [[${CHECK_FILES[i]}]] $([[ ${LAST_HASH[i]} != ${CUR_HASH[i]} ]] && echo '*' || echo '')
    Latest Hash:  ${LAST_HASH[i]}
    Current Hash: ${CUR_HASH[i]}
EOF
done

# endregion Files Check

echo "================================================================"

set -x

[[ ${HAS_CHANGE} -ne 0 ]] && docker restart ${DOCKER_CONTAINER_NAME} || echo 'No change'

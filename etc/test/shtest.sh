if [ ! -f "$1" ]; then
  echo "$1 is not a test file"
  exit 1
fi

function import () {
  local import_file_path=$1
  # echo ">>> ${import_file_path}"
  if [[ "${import_file_path}" =~ ^\. ]]; then
    import_file_path=$(dirname "${BASH_SOURCE[1]}")/${import_file_path}
    # echo ">1 ${import_file_path}"
  elif [[ "$import_file_path" =~ ^/ ]]; then
    import_file_path="${import_file_path}"
    # echo ">2 ${import_file_path}"
  else
    import_file_path="$(pwd)/${import_file_path}"
    # echo ">3 ${import_file_path}"
  fi

  source $(realpath $import_file_path)
}

declare -F | awk '{print $NF}' > /tmp/before_source.txt

import $1

declare -F | awk '{print $NF}' > /tmp/after_source.txt

test_cases=$(comm -13 /tmp/before_source.txt /tmp/after_source.txt | grep -E '^should')

echo "> [$1]:"
for test_case in $test_cases; do
  echo "> [$1][${test_case}]..."
  $test_case
  echo "> [$1][${test_case}]...Done"
done

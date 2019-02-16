#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname $0)/.."

test $# -eq 1 || (echo 'Missing resource name' && exit 128)
resource_name=$1
prefix='mystock'

test -f "cloudformation/${resource_name}.yaml" \
  || (echo 'Given resource does not exist.' && exit 128)

aws cloudformation create-stack \
  --stack-name "${prefix}${resource_name}" \
  --template-body file://./cloudformation/${resource_name}.yaml

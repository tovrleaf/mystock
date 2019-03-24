#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname $0)/.."

test $# -eq 1 || (echo 'Missing resource name' && exit 128)
resource_name=$1
prefix='mystock'

test -f "cloudformation/${resource_name}.yaml" \
  || (echo 'Given resource does not exist.' && exit 128)

stack_name="${prefix}-${resource_name}"

cmd='update-stack'
aws cloudformation describe-stacks --stack-name "${stack_name}" &>/dev/null || cmd='create-stack'

aws cloudformation ${cmd} \
  --stack-name "${prefix}-${resource_name}" \
  --template-body file://./cloudformation/${resource_name}.yaml

#!/usr/bin/env bash

cd "$(dirname ${0})/.."

jq -c '.[]' front/src/data/fixture.json | while read blob; do
    item=$(jq 'keys' <(echo $blob) | jq '.[]' | while read key; do
        val=$(echo $blob | jq ".[$key]")
        echo -n "${key}: {\"S\":${val}},"
    done)
    aws dynamodb put-item --table-name mystock-shares --item file://<(echo {${item::-1}})
done

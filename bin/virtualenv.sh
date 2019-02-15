#!/usr/bin/env bash

SOURCEDIR="${BASH_SOURCE}"
[ -z "${SOURCEDIR}" ] && SOURCEDIR="${0}"

cd "$(dirname ${SOURCEDIR})/.."

dir=".venv"

test -d "${dir}" || virtualenv "${dir}"
source "${dir}/bin/activate"
pip install -r requirements.txt

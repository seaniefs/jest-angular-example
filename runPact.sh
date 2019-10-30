#!/bin/bash
export PACT_BROKER_SCHEME="http"
export PACT_BROKER_HOST="localhost"
export PACT_BROKER_PORT=9292
export PACT_USERNAME="pacttest"
export PACT_PASSWORD="pacttest"
yarn pact:run
if [[ "$?" == "0" ]]; then
  yarn pact:publish
fi

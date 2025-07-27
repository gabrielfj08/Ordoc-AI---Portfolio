#!/bin/bash

set -e

bundle exec shoryuken --rails -C config/shoryuken/solr.yml -r ./app/workers

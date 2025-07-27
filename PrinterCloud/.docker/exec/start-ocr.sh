#!/bin/bash

set -e

bundle exec sidekiq -C config/sidekiq/ocr.yml

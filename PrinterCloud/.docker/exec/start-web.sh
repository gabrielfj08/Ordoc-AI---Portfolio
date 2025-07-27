#!/bin/bash

exec rails s -b 0.0.0.0 -e ${RAILS_ENV:-production}

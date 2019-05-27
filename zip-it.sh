#!/bin/bash
# Zips the site folder for submission, ignoring files that should be ignored.
zip -r simun.zip site README.md docs -x *.git* *node_modules* *.DS_Store*

#!/bin/bash
# Zips the site folder for submission, ignoring files that should be ignored.
zip -r site.zip site README.md LICENSE -x *.git* *node_modules* *.DS_Store*

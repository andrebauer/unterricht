#!/bin/sh
BUILD_DIR=_build/docs/betriebssysteme/virtualisierung/
wkhtmltoimage -f svg ${BUILD_DIR}asciidoc-basis-beispiel.html ${BUILD_DIR}asciidoc-basis-beispiel.svg

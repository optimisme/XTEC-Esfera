#!/usr/bin/env sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
SRC_DIR="$ROOT_DIR/src"
BUILD_DIR=$(mktemp -d)

cleanup() {
  rm -rf "$BUILD_DIR"
}
trap cleanup EXIT INT TERM

copy_common_files() {
  target_dir=$1

  mkdir -p "$target_dir/icons"
  cp "$SRC_DIR/background.js" "$target_dir/background.js"
  cp "$SRC_DIR/README.md" "$target_dir/README.md"
  cp "$SRC_DIR/content.js" "$target_dir/content.js"
  cp "$SRC_DIR/icons/icon-16.png" "$target_dir/icons/icon-16.png"
  cp "$SRC_DIR/icons/icon-32.png" "$target_dir/icons/icon-32.png"
  cp "$SRC_DIR/icons/icon-48.png" "$target_dir/icons/icon-48.png"
  cp "$SRC_DIR/icons/icon-128.png" "$target_dir/icons/icon-128.png"
}

create_zip() {
  package_dir=$1
  output_file=$2

  rm -f "$output_file"
  (
    cd "$package_dir"
    zip -q -r "$output_file" \
      background.js \
      README.md \
      icons/icon-16.png \
      icons/icon-32.png \
      icons/icon-48.png \
      icons/icon-128.png \
      manifest.json \
      content.js
  )
}

CHROME_DIR="$BUILD_DIR/chrome"
FIREFOX_DIR="$BUILD_DIR/firefox"

copy_common_files "$CHROME_DIR"
cp "$SRC_DIR/manifest.json" "$CHROME_DIR/manifest.json"

copy_common_files "$FIREFOX_DIR"
cp "$SRC_DIR/manifest.firefox.json" "$FIREFOX_DIR/manifest.json"

create_zip "$CHROME_DIR" "$ROOT_DIR/XTEC-Esfera-chrome.zip"
cp "$ROOT_DIR/XTEC-Esfera-chrome.zip" "$ROOT_DIR/XTEC-Esfera.zip"
create_zip "$FIREFOX_DIR" "$ROOT_DIR/XTEC-Esfera-firefox.zip"

printf '%s\n' "Created:"
printf '%s\n' "  XTEC-Esfera-chrome.zip"
printf '%s\n' "  XTEC-Esfera-firefox.zip"
printf '%s\n' "  XTEC-Esfera.zip"

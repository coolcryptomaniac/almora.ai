#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"
cp index.html "$ROOT/index.html"
cp theme-v3.css "$ROOT/theme-v3.css"
cp theme-v3.js "$ROOT/theme-v3.js"
mkdir -p "$ROOT/assets"
cp assets/aipan-mark.svg "$ROOT/assets/aipan-mark.svg"
echo "Almora Theme V3 copied into: $ROOT"
echo "Next: git add index.html theme-v3.css theme-v3.js assets/aipan-mark.svg && git commit"

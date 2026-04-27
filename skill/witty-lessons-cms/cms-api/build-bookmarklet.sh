#!/usr/bin/env bash
# Build the Witty CMS bookmarklet — concatenate builders + bridge, wrap, encode.
# Output: bookmarklet-url.txt (the `javascript:` URL the user pastes into a bookmark).

set -euo pipefail
cd "$(dirname "$0")"

SRC=$(cat builders.js bookmarklet-bridge.js)
WRAPPED="(async () => {
${SRC}
})();"

# Strip /* ... */ block comments and // line comments to shrink size.
# Conservative: only strip lines that START with // (preserves URLs in strings).
STRIPPED=$(printf '%s' "$WRAPPED" \
  | perl -0777 -pe 's{/\*.*?\*/}{}gs' \
  | sed -E 's|^[[:space:]]*//.*$||' \
  | sed -E '/^[[:space:]]*$/d')

# URL-encode for `javascript:` URL.
ENCODED=$(printf '%s' "$STRIPPED" | python3 -c "import sys, urllib.parse; sys.stdout.write(urllib.parse.quote(sys.stdin.read(), safe=''))")

printf 'javascript:%s' "$ENCODED" > bookmarklet-url.txt

SIZE=$(wc -c < bookmarklet-url.txt | tr -d ' ')
echo "Wrote bookmarklet-url.txt — ${SIZE} bytes"
echo "Install: open bookmarklet-url.txt, copy the entire line, create a new bookmark named \"Witty CMS Import\", paste as URL."

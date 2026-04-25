#!/bin/bash
# Pre-compile all .jsx files to .js using esbuild.
#
# Why: claude.ai artifacts run @babel/standalone in-browser to compile JSX which
# triggers a console warning. By shipping pre-compiled .js, we drop the Babel
# dependency entirely. esbuild transforms JSX → React.createElement() calls and
# preserves all global-variable usage (window.X = X) — no module wrapping.

set -e
cd "$(dirname "$0")"

build_file() {
  local src="$1"
  local out="${src%.jsx}.js"
  # Wrap each script in an IIFE so top-level helper vars don't collide
  # across files (Babel's text/babel scope-isolated each tag implicitly;
  # plain <script src=> tags share global scope).
  {
    echo "(function () {"
    npx esbuild "$src" --loader:.jsx=jsx --jsx=transform --target=es2020 --log-level=warning
    echo "})();"
  } > "$out"
  echo "  $src → $out"
}

echo "Building JSX → JS:"
for f in app.jsx app-tweaks.jsx app-main.jsx; do
  build_file "$f"
done
for f in components/*.jsx; do
  build_file "$f"
done

echo ""
echo "Done. .js files written next to .jsx sources."

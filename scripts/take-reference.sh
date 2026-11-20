#!/bin/sh
# Take the site's files again as the reference the parity tests hold this repository to.
#   scripts/take-reference.sh /path/to/alternate-viewsource
# Then `npm test`: whatever fails is the change to make here (docs/migration.md).
set -eu
site="${1:?the path to a checkout of alternate-viewsource}"
here="$(cd "$(dirname "$0")/.." && pwd)"
old="$(ls -d "$here"/reference/site-* | head -1)"
commit="$(git -C "$site" rev-parse HEAD)"
new="$here/reference/site-$(printf %.7s "$commit")"
[ "$old" = "$new" ] || git -C "$here" mv "$old" "$new"
mkdir -p "$new/lib/air" "$new/tokens" "$new/app"
cp "$site"/tokens/*.ts "$new/tokens/"
cp "$site/lib/color.ts" "$site/lib/time.ts" "$site/lib/column.ts" "$site/lib/flight.ts" "$new/lib/"
cp "$site/lib/air/field.ts" "$new/lib/air/"
cp "$site/app/globals.css" "$site/app/nav.css" "$new/app/"
cp "$site/scripts/validate-tokens.ts" "$new/validate-tokens.ts"
echo "$commit" > "$new/COMMIT"
echo "reference is now the site at $commit"
[ "$old" = "$new" ] || echo "the folder was renamed: update its name in tsconfig.test.json, tests/ and the docs"

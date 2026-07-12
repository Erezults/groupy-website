#!/bin/sh
# check-mirror.sh — detect drift between this repo and its mirror,
# the website/ directory inside the private app repo (Erezults/GroupyNative).
#
# This repo and GroupyNative/website must be kept in sync by hand (see README,
# "Dual maintenance"). Run this before/after editing copy in either place.
#
# Usage:
#   ./scripts/check-mirror.sh                 # auto-locates ../GroupyNative/website
#   MIRROR_DIR=/path/to/GroupyNative/website ./scripts/check-mirror.sh
#
# Exit codes: 0 = in sync, 1 = drift found, 2 = mirror not found.
# Read-only: never modifies either copy.

set -u

REPO_ROOT=$(cd "$(dirname "$0")/.." && pwd)

if [ -n "${MIRROR_DIR:-}" ]; then
  MIRROR="$MIRROR_DIR"
else
  MIRROR=""
  for candidate in \
    "$REPO_ROOT/../GroupyNative/website" \
    "$REPO_ROOT/../../GroupyNative/website" \
    "$HOME/GitSync/GroupyNative/website"; do
    if [ -d "$candidate" ]; then
      MIRROR=$(cd "$candidate" && pwd)
      break
    fi
  done
fi

if [ -z "$MIRROR" ] || [ ! -d "$MIRROR" ]; then
  echo "mirror not found — set MIRROR_DIR to the GroupyNative website/ path" >&2
  exit 2
fi

echo "comparing:"
echo "  site:   $REPO_ROOT"
echo "  mirror: $MIRROR"
echo

DRIFT=0

# Compare every file tracked by this repo against the mirror.
# CNAME and README.md are repo-specific (Pages config / repo docs), not app copy.
for f in $(git -C "$REPO_ROOT" ls-files); do
  case "$f" in
    CNAME|README.md|scripts/*|.gitignore) continue ;;
  esac
  if [ ! -f "$MIRROR/$f" ]; then
    echo "MISSING in mirror: $f"
    DRIFT=1
  elif ! cmp -s "$REPO_ROOT/$f" "$MIRROR/$f"; then
    echo "DIFFERS:           $f"
    DRIFT=1
  fi
done

# Files that exist only in the mirror (added in the app repo, not synced here).
(cd "$MIRROR" && find . -type f ! -name '.DS_Store' | sed 's|^\./||') | while read -r f; do
  case "$f" in
    CNAME|README.md|scripts/*|.gitignore) continue ;;
  esac
  if [ ! -f "$REPO_ROOT/$f" ]; then
    echo "MISSING here:      $f"
  fi
done > /tmp/check-mirror-extra.$$
if [ -s /tmp/check-mirror-extra.$$ ]; then
  cat /tmp/check-mirror-extra.$$
  DRIFT=1
fi
rm -f /tmp/check-mirror-extra.$$

if [ "$DRIFT" -eq 0 ]; then
  echo "in sync — no drift."
else
  echo
  echo "drift found — sync the copies (see README 'Dual maintenance')." >&2
fi
exit "$DRIFT"

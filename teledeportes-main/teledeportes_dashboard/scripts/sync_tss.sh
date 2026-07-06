#!/usr/bin/env bash
# Sync TSS (Trianametria Software Standards) into the local .tts/ folder.
# .tts/ is gitignored — it is a working copy, not vendored.
# Run on first clone, after pulling, or any time you suspect drift.
set -euo pipefail

REPO="${TSS_REPO:-https://github.com/Trianametria-Software/standards.git}"
REF="${TSS_REF:-vite-standards}"
TRACK="${TSS_TRACK:-vite}"
TARGET="${TSS_TARGET:-.tts}"

echo "[tss] syncing track '$TRACK' from $REPO@$REF -> ./$TARGET"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

git clone --depth 1 --branch "$REF" --quiet "$REPO" "$TMP/standards"

if [ ! -d "$TMP/standards/$TRACK" ]; then
    echo "[tss] error: track '$TRACK' not found in $REPO" >&2
    exit 1
fi

rm -rf "$TARGET"
mkdir -p "$TARGET"
cp -R "$TMP/standards/$TRACK/." "$TARGET/"

SHA="$(git -C "$TMP/standards" rev-parse --short HEAD)"
DATE="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
cat > "$TARGET/.sync_meta" <<EOF
repo:  $REPO
ref:   $REF
track: $TRACK
sha:   $SHA
synced_at: $DATE
EOF

echo "[tss] ok — pinned to $SHA"
echo "[tss] read .tts/README.md to start"

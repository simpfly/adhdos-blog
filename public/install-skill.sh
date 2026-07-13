#!/usr/bin/env bash
# ADHD OS Blog Agent Skill Installer.
# Downloads SKILL.md + README.md from https://blog.adhdos.app.

set -euo pipefail

SITE="https://blog.adhdos.app"
TARGET=""
INSTALL_DIR="${SKILL_DIR:-}"

usage() {
  cat <<'EOF'
Usage:
  install-skill.sh --target <claude|codex|gemini|copilot|opencode|agents>
  install-skill.sh --dir <absolute-or-home-relative-path>

Examples:
  bash install-skill.sh --target claude
  bash install-skill.sh --target codex
  bash install-skill.sh --dir "$HOME/.agents/skills/adhdos-kb"

The installer does not use sudo and writes only SKILL.md + README.md.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target)
      [[ $# -ge 2 ]] || { echo "[ERR] --target requires a value" >&2; exit 2; }
      TARGET="$2"
      shift 2
      ;;
    --dir)
      [[ $# -ge 2 ]] || { echo "[ERR] --dir requires a value" >&2; exit 2; }
      INSTALL_DIR="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "[ERR] unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if [[ -z "$INSTALL_DIR" ]]; then
  TARGET="${TARGET:-claude}"
  case "$TARGET" in
    claude) INSTALL_DIR="$HOME/.claude/skills/adhdos-kb" ;;
    codex) INSTALL_DIR="${CODEX_HOME:-$HOME/.codex}/skills/adhdos-kb" ;;
    gemini) INSTALL_DIR="$HOME/.gemini/skills/adhdos-kb" ;;
    copilot) INSTALL_DIR="$HOME/.copilot/skills/adhdos-kb" ;;
    opencode) INSTALL_DIR="$HOME/.config/opencode/skills/adhdos-kb" ;;
    agents) INSTALL_DIR="$HOME/.agents/skills/adhdos-kb" ;;
    *)
      echo "[ERR] unsupported target: $TARGET" >&2
      usage >&2
      exit 2
      ;;
  esac
else
  TARGET="${TARGET:-custom}"
fi

mkdir -p "$INSTALL_DIR"
TMP_DIR="$(mktemp -d "$INSTALL_DIR/.adhdos-install.XXXXXX")"
trap 'rm -rf "$TMP_DIR"' EXIT

echo ""
echo "Installing ADHD OS Agent Skill"
echo "  target: $TARGET"
echo "  path:   $INSTALL_DIR"
echo "  files:  SKILL.md, README.md"
echo ""

# Download and validate both files before replacing the installed copy.
curl -fsSL "$SITE/adhdos-skill/SKILL.md" -o "$TMP_DIR/SKILL.md"
curl -fsSL "$SITE/adhdos-skill/README.md" -o "$TMP_DIR/README.md"

grep -q '^name: adhdos-kb$' "$TMP_DIR/SKILL.md" || {
  echo "[ERR] downloaded SKILL.md failed identity validation" >&2
  exit 1
}
[[ -s "$TMP_DIR/README.md" ]] || {
  echo "[ERR] downloaded README.md is empty" >&2
  exit 1
}

cp "$TMP_DIR/SKILL.md" "$INSTALL_DIR/.SKILL.md.new"
cp "$TMP_DIR/README.md" "$INSTALL_DIR/.README.md.new"
chmod 0644 "$INSTALL_DIR/.SKILL.md.new" "$INSTALL_DIR/.README.md.new"
mv -f "$INSTALL_DIR/.SKILL.md.new" "$INSTALL_DIR/SKILL.md"
mv -f "$INSTALL_DIR/.README.md.new" "$INSTALL_DIR/README.md"

echo "Installed successfully."
echo ""
echo "Next: restart your Agent or start a new conversation, then ask:"
echo "  ADHD 拖延症与完美主义之间有什么关系？有什么自救方案吗？"
echo ""
echo "Success is verified when the response styles use clear headings with key points highlighted."

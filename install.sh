#!/bin/bash
# BizBrain OS Installer — one-line setup for macOS and Linux
# Usage: curl -fsSL https://bizbrain-os.com/install.sh | bash
set -e

echo ""
echo "  ____  _     ____            _         ___  ____"
echo " | __ )(_)___| __ ) _ __ __ _(_)_ __   / _ \/ ___|"
echo " |  _ \| |_  /  _ \| '__/ _\` | | '_ \ | | | \___ \\"
echo " | |_) | |/ /| |_) | | | (_| | | | | || |_| |___) |"
echo " |____/|_/___|____/|_|  \__,_|_|_| |_| \___/|____/"
echo ""
echo "  Downloading the BizBrain OS installer..."
echo ""

REPO="TechIntegrationLabs/create-bizbrain"
TMPDIR="${TMPDIR:-/tmp}"

# Detect OS and architecture
OS="$(uname -s)"
case "$OS" in
  Darwin) BINARY="bizbrain-setup-macos" ;;
  Linux)  BINARY="bizbrain-setup-linux" ;;
  *)
    echo "  Error: Unsupported OS ($OS). This script is for macOS and Linux."
    echo "  For Windows, download bizbrain-setup.exe from:"
    echo "  https://github.com/$REPO/releases/latest"
    exit 1
    ;;
esac

URL="https://github.com/$REPO/releases/latest/download/$BINARY"
DEST="$TMPDIR/$BINARY"

# Download
echo "  Downloading $BINARY..."
if command -v curl &> /dev/null; then
  curl -fsSL "$URL" -o "$DEST"
elif command -v wget &> /dev/null; then
  wget -q "$URL" -O "$DEST"
else
  echo "  Error: curl or wget is required."
  exit 1
fi

# Make executable
chmod +x "$DEST"

# macOS: remove quarantine attribute (Gatekeeper)
if [ "$OS" = "Darwin" ]; then
  xattr -d com.apple.quarantine "$DEST" 2>/dev/null || true
fi

echo "  Download complete. Starting installer..."
echo ""

# Run the installer
exec "$DEST"

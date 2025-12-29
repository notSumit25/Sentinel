#!/usr/bin/env bash
set -e

####################################
# Sentinel Agent Installer
####################################

AGENT_NAME="sentinel-agent"
INSTALL_DIR="/opt/sentinel"
CONFIG_DIR="/etc/sentinel"
SERVICE_FILE="/etc/systemd/system/sentinel-agent.service"

echo "🔍 Sentinel Agent Installer"

# -------------------------------
# Root check
# -------------------------------
if [[ $EUID -ne 0 ]]; then
  echo "❌ Please run as root (sudo)"
  exit 1
fi

# -------------------------------
# systemd check
# -------------------------------
if ! command -v systemctl >/dev/null 2>&1; then
  echo "❌ systemd not found. Sentinel supports systemd-based Linux only."
  exit 1
fi

# -------------------------------
# User input
# -------------------------------
echo ""
read -p "Tenant ID: " TENANT_ID
read -p "Host ID (unique name for this VM): " HOST_ID
read -p "Push interval in seconds [default: 10]: " INTERVAL
read -p "Redis URL [default: redis://localhost:6379]: " REDIS_URL

INTERVAL=${INTERVAL:-10}
REDIS_URL=${REDIS_URL:-redis://localhost:6379}

if [[ -z "$TENANT_ID" || -z "$HOST_ID" ]]; then
  echo "❌ Tenant ID and Host ID are required"
  exit 1
fi

# -------------------------------
# Create directories
# -------------------------------
echo "📁 Creating directories..."
mkdir -p "$INSTALL_DIR" "$CONFIG_DIR"

# -------------------------------
# Install binary
# -------------------------------
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [[ ! -f "$SCRIPT_DIR/$AGENT_NAME" ]]; then
  echo "❌ sentinel-agent binary not found next to install.sh"
  exit 1
fi

echo "⬇️ Installing Sentinel Agent binary..."
cp "$SCRIPT_DIR/$AGENT_NAME" "$INSTALL_DIR/$AGENT_NAME"
chmod +x "$INSTALL_DIR/$AGENT_NAME"

# -------------------------------
# Write config
# -------------------------------
echo "📝 Writing configuration..."

cat > "$CONFIG_DIR/config.env" <<EOF
TENANT_ID=$TENANT_ID
HOST_ID=$HOST_ID
INTERVAL=$INTERVAL
REDIS_URL=$REDIS_URL
EOF

chmod 600 "$CONFIG_DIR/config.env"

# -------------------------------
# systemd service
# -------------------------------
echo "⚙️ Registering systemd service..."

cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=Sentinel Metrics Agent
After=network.target

[Service]
ExecStart=$INSTALL_DIR/$AGENT_NAME
EnvironmentFile=$CONFIG_DIR/config.env
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# -------------------------------
# Enable + start service
# -------------------------------
systemctl daemon-reload
systemctl enable sentinel-agent
systemctl restart sentinel-agent

echo ""
echo "✅ Sentinel Agent installed successfully!"
echo "📌 Binary:  $INSTALL_DIR/$AGENT_NAME"
echo "📌 Config:  $CONFIG_DIR/config.env"
echo "📌 Service: sentinel-agent"

systemctl status sentinel-agent --no-pager

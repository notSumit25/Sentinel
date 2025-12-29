#!/usr/bin/env bash

sudo systemctl stop sentinel-agent || true
sudo systemctl disable sentinel-agent || true

sudo rm -rf /opt/sentinel
sudo rm -rf /etc/sentinel
sudo rm -f /etc/systemd/system/sentinel-agent.service

sudo systemctl daemon-reload

echo "🧹 Sentinel Agent removed"

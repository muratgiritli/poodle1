#!/usr/bin/env bash
# First-time Hetzner Ubuntu setup for YourPoodle
# Run as root on a fresh Ubuntu 24.04 VPS:
#   curl -fsSL https://raw.githubusercontent.com/muratgiritli/poodle1/main/scripts/hetzner-bootstrap.sh | bash
# Or copy this file to the server and: bash hetzner-bootstrap.sh

set -euo pipefail

apt-get update -y
apt-get install -y ca-certificates curl git ufw

# Docker
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi

systemctl enable --now docker

# Firewall: SSH + HTTP/HTTPS (app stays on localhost:5000 behind reverse proxy later)
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "Docker OK. Next:"
echo "  git clone https://github.com/muratgiritli/poodle1.git /opt/yourpoodle"
echo "  cd /opt/yourpoodle"
echo "  cp .env.example .env   # edit secrets"
echo "  docker compose -f docker-compose.prod.yml up -d --build"

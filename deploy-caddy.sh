#!/bin/bash
# Deploy Caddyfile with Cloudflare Origin Certificate

set -e

echo "Creating /etc/caddy/certs directory..."
sudo mkdir -p /etc/caddy/certs

echo "Copying certificate files to /etc/caddy/certs..."
sudo cp /home/pauleident/.openclaw/workspace/online-waivers/certs/cp30.* /etc/caddy/certs/

echo "Setting ownership and permissions..."
sudo chown -R caddy:caddy /etc/caddy/certs
sudo chmod 600 /etc/caddy/certs/cp30.key
sudo chmod 644 /etc/caddy/certs/cp30.crt

echo "Copying Caddyfile to /etc/caddy..."
sudo cp /home/pauleident/.openclaw/workspace/online-waivers/Caddyfile /etc/caddy/Caddyfile

echo "Testing Caddy configuration..."
sudo caddy validate --config /etc/caddy/Caddyfile

echo "Restarting Caddy..."
sudo systemctl restart caddy

echo "Waiting 3 seconds..."
sleep 3

echo "Checking Caddy status..."
sudo systemctl status caddy --no-pager -l | head -20

echo ""
echo "✅ Done! Try accessing https://cp30.pauleident.com in your browser."

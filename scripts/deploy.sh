#!/bin/bash
# ─────────────────────────────────────────────────────
#  A3B Platform — Deploy Script para Dokploy VPS
#  Uso: ./scripts/deploy.sh
# ─────────────────────────────────────────────────────

set -e
echo "🚀 A3B Platform — Iniciando deploy..."

# ─── Variables ────────────────────────────
VPS_IP="163.176.155.185"
VPS_USER="ubuntu"
PROJECT_DIR="/opt/a3b-platform"

# ─── 1. Verificar .env ────────────────────
if [ ! -f .env ]; then
  echo "❌ ERROR: No se encontró .env — copia .env.example y completa las variables"
  exit 1
fi
echo "✅ .env verificado"

# ─── 2. Build imágenes ────────────────────
echo "📦 Building Docker images..."
docker compose build --no-cache

# ─── 3. Push a DockerHub (opcional) ──────
# docker compose push

# ─── 4. Deploy en VPS ────────────────────
echo "🌐 Deploying to VPS ${VPS_IP}..."

ssh ${VPS_USER}@${VPS_IP} << 'ENDSSH'
  cd /opt/a3b-platform
  git pull origin main
  docker compose pull
  docker compose up -d --remove-orphans
  docker compose exec backend npm run db:migrate
  docker system prune -f
  echo "✅ Deploy completado"
ENDSSH

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║  ✅ A3B Platform deployed!            ║"
echo "║  Frontend: https://a3bhub.cloud       ║"
echo "║  API:      https://api.a3bhub.cloud   ║"
echo "╚═══════════════════════════════════════╝"

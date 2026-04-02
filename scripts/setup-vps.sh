#!/bin/bash
# ═══════════════════════════════════════════════════
#  A3B Platform — Deploy Completo en Dokploy / VPS
#  Uso: bash scripts/setup-vps.sh
# ═══════════════════════════════════════════════════

set -e
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
log()  { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
err()  { echo -e "${RED}❌ $1${NC}"; exit 1; }
info() { echo -e "${BLUE}ℹ  $1${NC}"; }

echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║   🔊 A3B Platform — Setup VPS             ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# ─── Verificar requisitos ─────────────────
command -v docker  >/dev/null 2>&1 || err "Docker no está instalado"
command -v git     >/dev/null 2>&1 || err "Git no está instalado"
[ -f ".env" ]                       || err "Crea el archivo .env desde .env.example primero"
log "Requisitos verificados"

# ─── Variables del .env ───────────────────
source .env
[ -z "$POSTGRES_PASSWORD" ] && err "POSTGRES_PASSWORD no está definida en .env"
[ -z "$JWT_SECRET" ]        && err "JWT_SECRET no está definida en .env"
[ -z "$STRIPE_SECRET_KEY" ] && warn "STRIPE_SECRET_KEY no definida — pagos desactivados"

# ─── Directorio del proyecto ──────────────
PROJECT_DIR="/opt/a3b-platform"
info "Instalando en $PROJECT_DIR"

# ─── Copiar archivos si es primera vez ────
if [ ! -d "$PROJECT_DIR" ]; then
  sudo mkdir -p $PROJECT_DIR
  sudo chown $USER:$USER $PROJECT_DIR
  cp -r . $PROJECT_DIR
  log "Archivos copiados a $PROJECT_DIR"
fi

cd $PROJECT_DIR

# ─── Levantar servicios ───────────────────
info "Levantando contenedores Docker..."
docker compose pull 2>/dev/null || true
docker compose up -d --build

# ─── Esperar PostgreSQL ───────────────────
info "Esperando PostgreSQL..."
for i in {1..30}; do
  docker compose exec postgres pg_isready -U $POSTGRES_USER -d $POSTGRES_DB >/dev/null 2>&1 && break
  echo -n "." && sleep 2
done
echo ""
log "PostgreSQL listo"

# ─── Migraciones ─────────────────────────
info "Ejecutando migraciones..."
docker compose exec backend npm run db:migrate 2>/dev/null || \
docker compose exec backend npx prisma migrate deploy
log "Base de datos migrada"

# ─── SSL con Certbot ─────────────────────
if [ ! -z "$DOMAIN" ]; then
  info "Configurando SSL para $DOMAIN..."
  docker run --rm \
    -v "$(pwd)/nginx/certs:/etc/letsencrypt" \
    -v "$(pwd)/nginx/www:/var/www/certbot" \
    -p 80:80 \
    certbot/certbot certonly \
    --standalone \
    --email $ADMIN_EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d api.$DOMAIN 2>/dev/null && log "SSL configurado" || warn "SSL falló — verifica el DNS"
fi

# ─── Health check ─────────────────────────
info "Verificando servicios..."
sleep 3
HEALTH=$(curl -s http://localhost:4000/health 2>/dev/null | grep -o '"status":"ok"' || echo "")
if [ -n "$HEALTH" ]; then
  log "API respondiendo correctamente"
else
  warn "API no responde todavía — puede necesitar más tiempo"
fi

echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║  ✅  A3B Platform desplegado              ║"
echo "║                                           ║"
printf "║  Frontend: https://%-22s║\n" "${DOMAIN:-localhost:3000}"
printf "║  API:      https://api.%-18s║\n" "${DOMAIN:-localhost:4000}"
echo "║  Admin:    /admin (requiere rol admin)    ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

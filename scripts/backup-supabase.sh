#!/bin/bash
# ============================================================
# Backup Script - Supabase V1TR0
# ============================================================
# Usage: bash scripts/backup-supabase.sh
# 
# Requisitos:
#   - Supabase CLI instalado
#   - SUPABASE_ACCESS_TOKEN configurado en .env.local
#   - Proyecto NO pausado en Supabase Dashboard
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_DIR/backups/$(date +%Y-%m-%d_%H-%M-%S)"

echo "========================================"
echo "  Backup del proyecto Supabase V1TR0"
echo "========================================"
echo ""
echo "Respaldo en: $BACKUP_DIR"

mkdir -p "$BACKUP_DIR"

# 1. Backup de migraciones locales
echo ""
echo "[1/5] Copiando migraciones locales..."
cp -r "$PROJECT_DIR/supabase/migrations" "$BACKUP_DIR/migrations"
echo "  ✅ Migraciones copiadas"

# 2. Consolidar schema actual en un solo archivo
echo ""
echo "[2/5] Consolidando schema actual..."
cat "$PROJECT_DIR/supabase/migrations/"*.sql > "$BACKUP_DIR/full_schema.sql" 2>/dev/null || true
echo "  ✅ Schema consolidado"

# 3. Intentar dump de la DB remota (solo si el proyecto no está pausado)
echo ""
echo "[3/5] Intentando dump remoto..."
if supabase link --project-ref ykrsxgpaxhtjsuebadnj 2>/dev/null; then
  supabase db dump -f "$BACKUP_DIR/remote_dump.sql"
  echo "  ✅ Dump remoto completado"
else
  echo "  ⚠️  No se pudo conectar. El proyecto puede estar pausado."
  echo "     Para restaurar: https://supabase.com/dashboard/project/ykrsxgpaxhtjsuebadnj"
  echo "     Haz clic en 'Restore project' y luego vuelve a ejecutar este script."
fi

# 4. Backup de config.toml y .env
echo ""
echo "[4/5] Respaldando configuración..."
cp "$PROJECT_DIR/supabase/config.toml" "$BACKUP_DIR/config.toml"
cp "$PROJECT_DIR/.env.local" "$BACKUP_DIR/env.local" 2>/dev/null || echo "  ⚠️  No se encontró .env.local"
echo "  ✅ Configuración respaldada"

# 5. Backup de migraciones Supabase CLI
echo ""
echo "[5/5] Respaldando migraciones CLI..."
if [ -d "$PROJECT_DIR/supabase/migrations" ]; then
  tar -czf "$BACKUP_DIR/migrations.tar.gz" -C "$PROJECT_DIR/supabase" migrations/
  echo "  ✅ Migraciones comprimidas"
fi

echo ""
echo "========================================"
echo "  Respaldo completado"
echo "  Ubicación: $BACKUP_DIR"
echo "========================================"
echo ""
echo "Para restaurar:"
echo "  1. Ir a https://supabase.com/dashboard/project/ykrsxgpaxhtjsuebadnj"
echo "  2. Restaurar el proyecto si está pausado"
echo "  3. Configurar Google OAuth en Authentication > Providers > Google"
echo "  4. Ejecutar: supabase link --project-ref ykrsxgpaxhtjsuebadnj"
echo "  5. Ejecutar: supabase db push"
echo ""

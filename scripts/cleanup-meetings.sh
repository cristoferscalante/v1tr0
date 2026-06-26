#!/bin/bash

echo "🧹 LIMPIEZA DE SISTEMA DE REUNIONES - V1TR0"
echo "==========================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar progreso
show_progress() {
    echo -e "${GREEN}✓${NC} $1"
}

show_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

show_error() {
    echo -e "${RED}✗${NC} $1"
}

# Verificar que estamos en la raíz del proyecto
if [ ! -f "package.json" ]; then
    show_error "Este script debe ejecutarse desde la raíz del proyecto"
    exit 1
fi

echo "📦 Paso 1: Eliminando APIs de reuniones..."
rm -rf app/api/calendar-availability && show_progress "Eliminado: app/api/calendar-availability"
rm -rf app/api/schedule-meeting && show_progress "Eliminado: app/api/schedule-meeting"
rm -rf app/api/meetings && show_progress "Eliminado: app/api/meetings"
rm -rf app/api/token-status && show_progress "Eliminado: app/api/token-status"
echo ""

echo "📦 Paso 2: Eliminando páginas de reuniones..."
rm -rf "app/(marketing)/agendar-reunion" && show_progress "Eliminado: app/(marketing)/agendar-reunion"
rm -rf "app/(dashboard)/dashboard/meetings" && show_progress "Eliminado: app/(dashboard)/dashboard/meetings"
echo ""

echo "📦 Paso 3: Eliminando servicios de Google Calendar..."
rm -f lib/google-calendar.ts && show_progress "Eliminado: lib/google-calendar.ts"
rm -f lib/google-auth.ts && show_progress "Eliminado: lib/google-auth.ts"
rm -f lib/supabase-meetings-db.ts && show_progress "Eliminado: lib/supabase-meetings-db.ts"
rm -f lib/server-meetings-db.ts && show_progress "Eliminado: lib/server-meetings-db.ts"
rm -f lib/local-meetings-db.ts && show_progress "Eliminado: lib/local-meetings-db.ts"
rm -f lib/auto-token-renewal.ts && show_progress "Eliminado: lib/auto-token-renewal.ts"
rm -f lib/init-auto-tokens.ts && show_progress "Eliminado: lib/init-auto-tokens.ts"
rm -f lib/token-maintenance.ts && show_progress "Eliminado: lib/token-maintenance.ts"
rm -f lib/auto-token-refresh.ts && show_progress "Eliminado: lib/auto-token-refresh.ts"
echo ""

echo "📦 Paso 4: Eliminando componentes de reuniones..."
rm -f components/dashboard/project-meetings.tsx && show_progress "Eliminado: components/dashboard/project-meetings.tsx"
rm -f components/dashboard/jitsi-meeting.tsx && show_progress "Eliminado: components/dashboard/jitsi-meeting.tsx"
echo ""

echo "📦 Paso 5: Eliminando scripts de OAuth..."
rm -f scripts/maintain-tokens.js && show_progress "Eliminado: scripts/maintain-tokens.js"
rm -f scripts/get-google-auth-url.js && show_progress "Eliminado: scripts/get-google-auth-url.js"
rm -f scripts/exchange-google-code.js && show_progress "Eliminado: scripts/exchange-google-code.js"
rm -f scripts/refresh-google-auth.js && show_progress "Eliminado: scripts/refresh-google-auth.js"
rm -f scripts/update-tokens-from-playground.js && show_progress "Eliminado: scripts/update-tokens-from-playground.js"
echo ""

echo "📦 Paso 6: Eliminando datos y documentación..."
rm -f data/meetings.json && show_progress "Eliminado: data/meetings.json"
rm -f docs/flujos/transcripciones-reuniones.md && show_progress "Eliminado: docs/flujos/transcripciones-reuniones.md"
rm -f SETUP_WEBHOOK.md && show_progress "Eliminado: SETUP_WEBHOOK.md"
rm -f TOKEN_MAINTENANCE.md && show_progress "Eliminado: TOKEN_MAINTENANCE.md"
echo ""

echo "📦 Paso 7: Eliminando archivos duplicados y sin uso..."
rm -f "app/(dashboard)/dashboard/page-backup.tsx" && show_progress "Eliminado: dashboard/page-backup.tsx"
rm -f "app/(dashboard)/dashboard/page-new.tsx" && show_progress "Eliminado: dashboard/page-new.tsx"
rm -f "app/(dashboard)/dashboard/page-original.tsx" && show_progress "Eliminado: dashboard/page-original.tsx"
rm -f "app/(dashboard)/dashboard/page-simple.tsx" && show_progress "Eliminado: dashboard/page-simple.tsx"
echo ""

echo "📦 Paso 8: Eliminando archivos de debug y outputs..."
rm -f debug-login.js && show_progress "Eliminado: debug-login.js"
rm -f tsc_output.txt && show_progress "Eliminado: tsc_output.txt"
rm -f tsc_output_2.txt && show_progress "Eliminado: tsc_output_2.txt"
rm -f tsc_output_3.txt && show_progress "Eliminado: tsc_output_3.txt"
rm -f package-lock.json.backup && show_progress "Eliminado: package-lock.json.backup"
rm -f clear-browser-storage.html && show_progress "Eliminado: clear-browser-storage.html"
echo ""

echo "📦 Paso 9: Organizando archivos de test..."
mkdir -p tests/utils
if [ -f "test-supabase.js" ]; then
    mv test-supabase.js tests/utils/ && show_progress "Movido: test-supabase.js -> tests/utils/"
fi
if [ -f "check-user-exists.js" ]; then
    mv check-user-exists.js tests/utils/ && show_progress "Movido: check-user-exists.js -> tests/utils/"
fi
echo ""

echo "✨ Limpieza completada!"
echo ""
echo "📊 Resumen:"
echo "  - APIs eliminadas: 4"
echo "  - Páginas eliminadas: 2"
echo "  - Servicios eliminados: 9"
echo "  - Componentes eliminados: 2"
echo "  - Scripts eliminados: 5"
echo "  - Archivos sin uso eliminados: 10+"
echo ""
echo "⚠️  IMPORTANTE:"
echo "  1. Ejecuta 'pnpm remove googleapis nodemailer @types/nodemailer open date-fns-tz'"
echo "  2. Revisa y actualiza package.json para eliminar scripts obsoletos"
echo "  3. Ejecuta 'pnpm install' para limpiar node_modules"
echo "  4. Verifica que el build funcione: 'pnpm build'"
echo ""

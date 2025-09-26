#!/usr/bin/env node
const { execSync } = require('child_process');

// Detectar si se está intentando usar npm o yarn
const userAgent = process.env.npm_config_user_agent;

if (userAgent && !userAgent.includes('pnpm')) {
  console.error('\n❌ Este proyecto usa PNPM exclusivamente');
  console.error('📦 Por favor usa: pnpm install');
  console.error('🚀 Para desarrollo: pnpm dev');
  console.error('🔨 Para build: pnpm build\n');
  process.exit(1);
}

console.log('✅ Usando pnpm correctamente!');
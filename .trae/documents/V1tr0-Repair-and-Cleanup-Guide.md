# V1tr0 - Guía de Reparación y Limpieza del Proyecto

## 1. Análisis de Problemas Identificados

### 1.1 Archivos de Test Huérfanos

Se han identificado los siguientes archivos de test que no están integrados en el ecosistema funcional:

- `test-available-slots.js` - Test manual para verificar disponibilidad de horarios
- `test-dates-parsing.js` - Test para verificar parseo de fechas en URLs
- `test-specific-dates.js` - Test específico para fechas problemáticas
- `test-supabase-connection.js` - Test de conexión a Supabase

**Problemas:**
- No están integrados con un framework de testing (Jest, Vitest)
- Contienen credenciales hardcodeadas de Supabase
- No siguen las convenciones de testing del proyecto
- Están en la raíz del proyecto en lugar de una carpeta `tests/`

### 1.2 Configuración Inconsistente

**Archivos de configuración duplicados:**
- `next.config.js` y `next.config.mjs` (conflicto potencial)
- Configuración de ESLint dispersa

**Variables de entorno:**
- Falta archivo `.env.example` para guiar la configuración
- No hay validación de variables de entorno requeridas

### 1.3 Dependencias y Estructura

**Dependencias problemáticas:**
- `fs@0.0.1-security` - Dependencia innecesaria y potencialmente insegura
- `path@0.12.7` - Redundante (Node.js ya incluye módulo path)

**Estructura de archivos:**
- Archivos de configuración MDX duplicados
- Falta organización clara de tipos TypeScript

## 2. Plan de Reparación y Limpieza

### 2.1 Eliminación de Archivos de Test Huérfanos

**Archivos a eliminar:**
```bash
# Eliminar archivos de test huérfanos
rm test-available-slots.js
rm test-dates-parsing.js
rm test-specific-dates.js
rm test-supabase-connection.js
```

**Justificación:**
- No están integrados en el pipeline de CI/CD
- Contienen información sensible (credenciales)
- No siguen las mejores prácticas de testing
- Pueden ser reemplazados por tests unitarios apropiados

### 2.2 Configuración de Testing Apropiada

**Crear estructura de testing moderna:**
```
__tests__/
├── components/
├── pages/
├── api/
├── utils/
└── setup.ts
```

**Configurar Vitest (recomendado para Next.js 15):**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "vitest": "^1.0.0",
    "jsdom": "^23.0.0"
  }
}
```

### 2.3 Limpieza de Dependencias

**Dependencias a eliminar:**
```bash
npm uninstall fs path
```

**Dependencias a actualizar:**
```bash
# Verificar y actualizar dependencias obsoletas
npm audit
npm update
```

### 2.4 Consolidación de Configuración

**Eliminar archivos duplicados:**
- Mantener solo `next.config.mjs`
- Consolidar configuración de MDX

## 3. Implementación de Reparaciones

### 3.1 Script de Limpieza Automática

**Crear `scripts/cleanup.js`:**
```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Iniciando limpieza del proyecto V1tr0...');

// Archivos a eliminar
const filesToDelete = [
  'test-available-slots.js',
  'test-dates-parsing.js', 
  'test-specific-dates.js',
  'test-supabase-connection.js',
  'next.config.js' // Mantener solo .mjs
];

// Eliminar archivos huérfanos
filesToDelete.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`✅ Eliminado: ${file}`);
  } else {
    console.log(`⚠️  No encontrado: ${file}`);
  }
});

console.log('✨ Limpieza completada');
```

### 3.2 Configuración de Variables de Entorno

**Crear `.env.example`:**
```env
# ===========================================
# CONFIGURACIÓN DE SUPABASE
# ===========================================
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_servicio

# ===========================================
# CONFIGURACIÓN DE GOOGLE APIS
# ===========================================
GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_REFRESH_TOKEN=tu_refresh_token

# ===========================================
# CONFIGURACIÓN DE EMAIL
# ===========================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password

# ===========================================
# CONFIGURACIÓN DE LA APP
# ===========================================
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secret_muy_seguro
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.3 Validación de Variables de Entorno

**Crear `lib/env-validation.ts`:**
```typescript
import { z } from 'zod';

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  
  // Google APIs
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REFRESH_TOKEN: z.string().min(1),
  
  // Email
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.string().transform(Number),
  SMTP_USER: z.string().email(),
  SMTP_PASS: z.string().min(1),
  
  // App
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

### 3.4 Configuración de Testing Moderna

**Crear `vitest.config.ts`:**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

**Crear `test-setup.ts`:**
```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de Next.js router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/',
    query: {},
  }),
}));

// Mock de Supabase
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
    })),
  },
}));
```

## 4. Reparación de Errores Específicos

### 4.1 Problemas de Configuración de Next.js

**Consolidar `next.config.mjs`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Configuración MDX
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
```

### 4.2 Problemas de TypeScript

**Actualizar `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

### 4.3 Problemas de ESLint

**Consolidar `eslint.config.mjs`:**
```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;
```

## 5. Verificación Post-Reparación

### 5.1 Checklist de Verificación

- [ ] **Archivos de test huérfanos eliminados**
- [ ] **Dependencias innecesarias removidas**
- [ ] **Configuración consolidada**
- [ ] **Variables de entorno validadas**
- [ ] **Testing framework configurado**
- [ ] **Build exitoso**
- [ ] **Desarrollo funcional**

### 5.2 Comandos de Verificación

```bash
# Verificar que no hay errores de TypeScript
npx tsc --noEmit

# Verificar linting
npm run lint

# Verificar build
npm run build

# Verificar que el desarrollo funciona
npm run dev
```

### 5.3 Tests de Funcionalidad

```bash
# Ejecutar tests unitarios
npm run test

# Verificar cobertura
npm run test:coverage

# Verificar que las páginas principales cargan
curl http://localhost:3000
curl http://localhost:3000/blog
curl http://localhost:3000/services
```

## 6. Mejoras Adicionales Recomendadas

### 6.1 Configuración de Pre-commit Hooks

**Instalar Husky:**
```bash
npm install --save-dev husky lint-staged
npx husky install
```

**Configurar `.husky/pre-commit`:**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**Configurar `package.json`:**
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,mdx}": [
      "prettier --write"
    ]
  }
}
```

### 6.2 Configuración de CI/CD

**Crear `.github/workflows/ci.yml`:**
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build
```

### 6.3 Documentación de APIs

**Configurar Swagger/OpenAPI:**
```bash
npm install --save-dev swagger-jsdoc swagger-ui-react
```

## 7. Mantenimiento Continuo

### 7.1 Actualizaciones Regulares

```bash
# Verificar dependencias obsoletas
npm outdated

# Actualizar dependencias menores
npm update

# Auditar seguridad
npm audit
npm audit fix
```

### 7.2 Monitoreo de Performance

**Configurar Lighthouse CI:**
```bash
npm install --save-dev @lhci/cli
```

**Crear `lighthouserc.js`:**
```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      startServerCommand: 'npm run start',
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
      },
    },
  },
};
```

## 8. Resultado Esperado

Después de aplicar todas las reparaciones:

✅ **Proyecto limpio y organizado**
- Sin archivos huérfanos o innecesarios
- Configuración consolidada y consistente
- Dependencias optimizadas

✅ **Testing moderno configurado**
- Framework de testing apropiado (Vitest)
- Tests unitarios y de integración
- Cobertura de código

✅ **Desarrollo optimizado**
- Build rápido y confiable
- Hot reload funcional
- Linting y formateo automático

✅ **Producción lista**
- Variables de entorno validadas
- Configuración de seguridad
- Pipeline de CI/CD

---

**Tiempo estimado de reparación:** 2-4 horas  
**Nivel de dificultad:** Intermedio  
**Impacto:** Alto (mejora significativa en mantenibilidad)

**Última actualización:** Enero 2025
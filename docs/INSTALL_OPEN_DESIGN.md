# 🖥️ Instalación de Open Design Desktop App (Linux)

## Opción 1: Desktop App con GUI (Recomendado)

### Descargar

Descarga la última versión desde GitHub Releases:

**URL:** https://github.com/nexu-io/open-design/releases/tag/open-design-v0.13.0

**Archivo para Linux:**
- `open-design-0.13.0-linux-x64.AppImage` (x86_64)

### Instalación

```bash
# 1. Descargar (puedes usar wget o descargar desde el navegador)
wget https://github.com/nexu-io/open-design/releases/download/open-design-v0.13.0/open-design-0.13.0-linux-x64.AppImage

# 2. Hacer ejecutable
chmod +x open-design-0.13.0-linux-x64.AppImage

# 3. Ejecutar
./open-design-0.13.0-linux-x64.AppImage
```

### Instalación Permanente (Opcional)

```bash
# Mover a /usr/local/bin para acceso global
sudo mv open-design-0.13.0-linux-x64.AppImage /usr/local/bin/open-design

# Ahora puedes ejecutar desde cualquier lugar
open-design
```

### Crear Desktop Entry (Opcional)

Para que aparezca en el menú de aplicaciones:

```bash
# Crear archivo .desktop
cat > ~/.local/share/applications/open-design.desktop <<EOF
[Desktop Entry]
Name=Open Design
Comment=The open-source Claude Design alternative
Exec=/usr/local/bin/open-design
Icon=open-design
Type=Application
Categories=Development;Design;
Terminal=false
EOF

# Actualizar base de datos de aplicaciones
update-desktop-database ~/.local/share/applications/
```

---

## Opción 2: MCP Server (Sin GUI - Para CLI)

Si prefieres usar Open Design solo desde la línea de comandos sin GUI:

```bash
# 1. Instalar globalmente con npm
npm install -g open-design

# O con pnpm (desde el proyecto)
cd /home/efren-cyborg/1.Cyborg-Town/3.V1TR0-Town/1.proyectos-endogenos-/1.v1tr0-proyec/1.v1tr0-web
pnpm add -g open-design

# 2. Verificar instalación
od --version

# 3. Configurar MCP server para OpenCode
od mcp install opencode

# O desde el proyecto:
pnpm run od:mcp
```

---

## Configuración Post-Instalación

### 1. Abrir Open Design Desktop

```bash
# Si instalaste como AppImage:
./open-design-0.13.0-linux-x64.AppImage

# O si lo moviste a /usr/local/bin:
open-design
```

### 2. Configuración Inicial en la GUI

1. **Primera vez:** La app te pedirá configurar un agente
2. **Selecciona:** OpenCode (si lo tienes instalado)
3. **Carga el proyecto:** Abre la carpeta `v1tr0-web`
4. **El sistema detectará automáticamente:** `DESIGN.md`

### 3. Importar el Design System V1TR0

Dentro de la app:

1. Ve a **Design System** → **Import**
2. Selecciona `DESIGN.md` en la raíz del proyecto
3. La app parseará automáticamente:
   - Colores
   - Tipografía
   - Espaciado
   - Componentes

---

## Uso desde la GUI

### Generar un Componente

1. **Home** → **Create New**
2. **Skill:** Selecciona "Landing Page Hero" (o custom)
3. **Design System:** V1TR0 (auto-detectado)
4. **Prompt:** "Hero section con 3D elements y glow effects"
5. **Generate** → La app generará el componente en tiempo real

### Ver Prototipos

1. **Studio** → **Prototypes**
2. Verás preview en vivo del HTML/React generado
3. **Export:** HTML, PDF, PPTX, PNG

### Generar Assets Visuales

1. **Studio** → **Image**
2. **Prompt:** "Modern dashboard hero with V1TR0 branding"
3. **Style:** Se aplicará automáticamente la paleta V1TR0
4. **Generate** → Imagen WebP optimizada

---

## Integración con el Proyecto V1TR0

### Desde la GUI

1. **Open Project** → Selecciona `v1tr0-web/`
2. La app detectará:
   - ✅ `DESIGN.md`
   - ✅ `.opendesign/config.json`
   - ✅ Skills en `.opendesign/skills/`
   - ✅ `package.json` scripts

3. **Generar desde la app** → Los archivos se guardarán automáticamente en:
   - `public/generated/`
   - `components/generated/`

### Desde CLI (con MCP)

```bash
# Dentro del proyecto
cd v1tr0-web

# Generar con el script interactivo
./scripts/generate-design.sh

# O usar comandos npm
pnpm run od:generate
```

---

## Verificar Instalación

### Desktop App

```bash
# Ejecutar y verificar que abre la GUI
./open-design-0.13.0-linux-x64.AppImage
```

Deberías ver:
- ✅ Splash screen "Open Design"
- ✅ Ventana principal con Home, Studio, Design System
- ✅ Sin errores en la consola

### CLI/MCP

```bash
# Verificar comando od
od --version
# Output esperado: open-design v0.13.0

# Verificar MCP config
cat ~/.config/opencode/mcp.json
# Debería tener una entrada para "open-design"

# Listar proyectos indexados
od list projects
```

---

## Troubleshooting

### Error: "AppImage: No such file or directory"

```bash
# Verificar que descargaste el archivo correcto
file open-design-0.13.0-linux-x64.AppImage
# Output esperado: ELF 64-bit LSB executable

# Verificar permisos
ls -l open-design-0.13.0-linux-x64.AppImage
# Debe tener 'x' (ejecutable)

# Dar permisos si no los tiene
chmod +x open-design-0.13.0-linux-x64.AppImage
```

### Error: "FUSE not available"

Algunos sistemas requieren FUSE para AppImages:

```bash
# Ubuntu/Debian
sudo apt install fuse libfuse2

# Fedora
sudo dnf install fuse fuse-libs

# Arch
sudo pacman -S fuse2
```

### Error: "od: command not found" (CLI)

```bash
# Reinstalar
npm install -g open-design

# O usar npx temporal
npx open-design --version

# Verificar PATH
echo $PATH | grep node
```

### La app no detecta DESIGN.md

```bash
# Verificar que DESIGN.md está en la raíz
ls -la /home/efren-cyborg/1.Cyborg-Town/3.V1TR0-Town/1.proyectos-endogenos-/1.v1tr0-proyec/1.v1tr0-web/DESIGN.md

# Verificar contenido
head -n 5 DESIGN.md
# Debería empezar con "# V1TR0 Design System"

# Recargar proyecto en la GUI
# GUI → File → Reload Project
```

---

## Primeros Pasos Recomendados

### 1. Prueba la Desktop App

```bash
# Ejecutar
./open-design-0.13.0-linux-x64.AppImage

# En la GUI:
# 1. Home → "Create New"
# 2. Skill: "Feature Card"  
# 3. Design System: V1TR0
# 4. Prompt: "Feature card para gestión de proyectos"
# 5. Generate
```

### 2. Prueba el Script Interactivo

```bash
cd v1tr0-web
./scripts/generate-design.sh

# Selecciona opción 1 (Hero Section)
# Verifica que se genera en:
ls -la components/generated/
```

### 3. Prueba la Integración con OpenCode

```typescript
// En OpenCode chat:
"Usa open-design para generar un hero section siguiendo DESIGN.md de V1TR0"

// OpenCode debería:
// 1. Conectar al MCP server
// 2. Leer DESIGN.md
// 3. Generar el componente
// 4. Guardarlo en components/generated/
```

---

## Recursos Adicionales

### Documentación
- **Guía de Uso:** `docs/OPEN_DESIGN_GUIDE.md`
- **Resumen:** `docs/OPEN_DESIGN_SUMMARY.md`
- **Design System:** `DESIGN.md`
- **Skills:** `.opendesign/skills/README.md`

### Links Externos
- **GitHub Releases:** https://github.com/nexu-io/open-design/releases
- **Documentación oficial:** https://open-design.ai/docs
- **Discord:** https://discord.gg/mHAjSMV6gz

---

## Comandos Útiles

```bash
# Ver versión
od --version

# Listar skills disponibles
od skills list

# Ver design systems
od design-systems list

# Generar componente específico
od generate component --type hero --name HeroV1tr0

# Iniciar servidor MCP
od daemon start

# Ver logs
od daemon logs

# Detener servidor
od daemon stop
```

---

## ¡Listo!

Ahora tienes:

1. ✅ **Desktop App instalada** (GUI completa)
2. ✅ **CLI disponible** (comando `od`)
3. ✅ **MCP configurado** (integración con OpenCode)
4. ✅ **Proyecto conectado** (DESIGN.md detectado)

**Siguiente paso:**
```bash
# Probar generación
./scripts/generate-design.sh
```

---

**Última actualización:** 2026-07-06  
**Versión de Open Design:** 0.13.0  
**Sistema:** Linux x86_64

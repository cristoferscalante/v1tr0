# 🔧 Guía de Solución de Problemas SMTP

## 📊 Diagnóstico Actual

**Estado:** ❌ Error de Autenticación  
**Código de Error:** `535 5.7.8 Error: authentication failed: (reason unavailable)`  
**Servidor:** `smtp.hostinger.com`  
**Conectividad:** ✅ Servidor accesible  
**Problema:** 🔐 Credenciales de autenticación inválidas  

---

## 🚨 Problema Identificado

El diagnóstico SMTP ha confirmado que:
- ✅ El servidor `smtp.hostinger.com` es accesible
- ✅ Las configuraciones SSL/TLS están correctas
- ❌ Las credenciales de autenticación están fallando
- ❌ Tanto puerto 465 (SSL) como 587 (STARTTLS) fallan con el mismo error

---

## 🔍 Posibles Causas del Error 535 5.7.8

### 1. **Credenciales Incorrectas**
- Usuario o contraseña incorrectos
- Contraseña expirada o cambiada
- Formato de usuario incorrecto

### 2. **Configuración de Cuenta de Email**
- Cuenta de email no configurada correctamente en Hostinger
- Cuenta suspendida o deshabilitada
- Límites de envío excedidos

### 3. **Configuración del Dominio**
- Dominio no verificado en Hostinger
- Registros DNS faltantes o incorrectos
- Configuración de SPF/DKIM/DMARC

### 4. **Restricciones del Proveedor**
- Autenticación de dos factores habilitada
- Restricciones de IP o geográficas
- Políticas de seguridad del proveedor

---

## ✅ Soluciones Recomendadas

### **Paso 1: Verificar Credenciales**
```bash
# Verificar variables de entorno actuales
SMTP_USER=buzon@v1tr0.com
SMTP_PASS=Xpcnt7938
```

**Acciones:**
1. Confirmar que `buzon@v1tr0.com` existe en el panel de Hostinger
2. Verificar que la contraseña `Xpcnt7938` es correcta
3. Intentar hacer login manual en el webmail de Hostinger

### **Paso 2: Configuración en Panel de Hostinger**
1. **Acceder al Panel de Control de Hostinger**
   - Ir a `Emails` → `Email Accounts`
   - Verificar que `buzon@v1tr0.com` está activa

2. **Verificar Configuración SMTP**
   - Confirmar que SMTP está habilitado para la cuenta
   - Verificar límites de envío diarios
   - Revisar configuración de autenticación

3. **Regenerar Contraseña**
   - Cambiar la contraseña de la cuenta de email
   - Actualizar `.env.local` con la nueva contraseña

### **Paso 3: Configuración de Dominio**
1. **Verificar Dominio**
   - Confirmar que `v1tr0.com` está verificado
   - Revisar configuración DNS

2. **Configurar Registros SPF**
   ```dns
   v=spf1 include:spf.hostinger.com ~all
   ```

3. **Configurar DKIM** (si está disponible)
   - Habilitar DKIM en el panel de Hostinger
   - Agregar registros DNS correspondientes

### **Paso 4: Configuraciones Alternativas**

#### **Opción A: Puerto 587 con STARTTLS**
```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_TLS=true
```

#### **Opción B: Puerto 465 con SSL**
```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_TLS=true
```

### **Paso 5: Configuraciones de Seguridad**
1. **Deshabilitar Autenticación de Dos Factores** (temporalmente)
2. **Verificar Restricciones de IP**
3. **Revisar Políticas de Seguridad**

---

## 🧪 Herramientas de Diagnóstico

### **Endpoint de Diagnóstico**
```bash
# Ejecutar diagnóstico completo
curl http://localhost:3000/api/smtp-test
```

### **Prueba Manual de Credenciales**
```bash
# Probar conexión con telnet (Windows)
telnet smtp.hostinger.com 587
```

### **Verificar Logs del Servidor**
- Revisar logs en el terminal de Next.js
- Buscar mensajes detallados de error

---

## 📋 Lista de Verificación

- [ ] **Credenciales verificadas en panel de Hostinger**
- [ ] **Cuenta de email activa y funcional**
- [ ] **Contraseña actualizada y correcta**
- [ ] **Dominio verificado y configurado**
- [ ] **Registros DNS (SPF/DKIM) configurados**
- [ ] **Límites de envío no excedidos**
- [ ] **Sin restricciones de IP o geográficas**
- [ ] **Configuración SSL/TLS correcta**

---

## 🆘 Contacto de Soporte

Si el problema persiste después de seguir todos los pasos:

1. **Contactar Soporte de Hostinger**
   - Proporcionar el error exacto: `535 5.7.8 Error: authentication failed`
   - Mencionar la cuenta: `buzon@v1tr0.com`
   - Solicitar verificación de configuración SMTP

2. **Información para Soporte**
   - Dominio: `v1tr0.com`
   - Cuenta de email: `buzon@v1tr0.com`
   - Servidor SMTP: `smtp.hostinger.com`
   - Puertos probados: 465 (SSL) y 587 (STARTTLS)
   - Error: Autenticación fallida

---

## 📈 Próximos Pasos

1. **Inmediatos:**
   - Verificar credenciales en panel de Hostinger
   - Regenerar contraseña si es necesario
   - Probar configuración actualizada

2. **Mediano Plazo:**
   - Configurar registros SPF/DKIM
   - Implementar monitoreo de envío de emails
   - Configurar logs detallados

3. **Largo Plazo:**
   - Considerar servicio de email transaccional (SendGrid, Mailgun)
   - Implementar sistema de colas para emails
   - Configurar métricas de entregabilidad

---

*Última actualización: $(date)*  
*Generado por: Sistema de Diagnóstico SMTP V1TR0*
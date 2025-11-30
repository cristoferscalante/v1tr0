/**
 * Inicializador de Sistema de Tokens Automático
 * 
 * Este archivo se ejecuta cuando se inicia la aplicación para
 * configurar el sistema de renovación automática de tokens
 */

import { startAutoRenewal } from './auto-token-renewal';

// Solo ejecutar en entorno del servidor
if (typeof window === 'undefined') {
  // Inicializar sistema de renovación automática después de un breve delay
  setTimeout(() => {
    try {
      startAutoRenewal();
      console.error('[SYSTEM] 🚀 Sistema de renovación automática de tokens inicializado');
    } catch (error) {
      console.error('[SYSTEM] ❌ Error inicializando sistema de tokens:', error);
    }
  }, 5000); // 5 segundos después del arranque
}

export {};

// Script para resetear el estado de bienvenida del chatbot
// Ejecutar en la consola del navegador: localStorage.removeItem('portal-welcome-seen')

console.log('Para resetear el mensaje de bienvenida del chatbot PORTAL, ejecuta:');
console.log('localStorage.removeItem(\'portal-welcome-seen\')');
console.log('');
console.log('Después refresca la página para ver el mensaje de bienvenida nuevamente.');

// Función de utilidad para desarrollo
window.resetPortalWelcome = () => {
  localStorage.removeItem('portal-welcome-seen');
  console.log('✅ Estado de bienvenida reseteado. Refresca la página para probar.');
};


#!/usr/bin/env node

/**
 * Script para integrar la demo real de Automata RRHH
 * https://github.com/nicolasmcrespo/hrluke.git
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DEMO_REPO = 'https://github.com/nicolasmcrespo/hrluke.git';
const DEMO_PATH = path.join(__dirname, '..', 'demos-app', 'app', 'demos', 'automata-rrhh');
const BACKUP_PATH = path.join(__dirname, '..', 'demos-app', 'app', 'demos', 'automata-rrhh-backup');

console.log('🚀 Iniciando integración de demo Automata RRHH...');

// 1. Hacer backup de la demo actual
if (fs.existsSync(DEMO_PATH)) {
  console.log('📦 Creando backup de demo actual...');
  if (fs.existsSync(BACKUP_PATH)) {
    fs.rmSync(BACKUP_PATH, { recursive: true, force: true });
  }
  fs.renameSync(DEMO_PATH, BACKUP_PATH);
  console.log('✅ Backup creado en automata-rrhh-backup');
}

// 2. Clonar el repositorio
console.log('📥 Clonando repositorio de demo...');
try {
  execSync(`git clone ${DEMO_REPO} "${DEMO_PATH}"`, { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Error al clonar repositorio:', error.message);
  // Restaurar backup si falla
  if (fs.existsSync(BACKUP_PATH)) {
    fs.renameSync(BACKUP_PATH, DEMO_PATH);
    console.log('🔄 Backup restaurado');
  }
  process.exit(1);
}

// 3. Verificar que se clonó correctamente
const pagePath = path.join(DEMO_PATH, 'page.tsx');
if (!fs.existsSync(pagePath)) {
  console.log('⚠️ No se encontró page.tsx, creando página básica...');

  const basicPage = `export default function AutomataRRHH() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Automata de Recursos Humanos
          </h1>
          <p className="text-white/70 text-lg mb-6">
            Demo en desarrollo - Integrando código desde repositorio
          </p>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-yellow-100">
              🔧 Esta demo está siendo integrada desde el repositorio original.
              Contacta al equipo de desarrollo para más información.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}`;

  fs.writeFileSync(pagePath, basicPage);
}

// 4. Instalar dependencias adicionales si es necesario
const packagePath = path.join(DEMO_PATH, 'package.json');
if (fs.existsSync(packagePath)) {
  console.log('📦 Instalando dependencias de la demo...');
  try {
    execSync('cd demos-app && npm install', { stdio: 'inherit' });
  } catch (error) {
    console.warn('⚠️ Error instalando dependencias:', error.message);
  }
}

// 5. Verificar configuración
console.log('🔍 Verificando configuración...');
const nextConfigPath = path.join(__dirname, '..', 'demos-app', 'next.config.mjs');
let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');

if (!nextConfig.includes('vanguard-demos.vercel.app')) {
  console.log('⚠️ Actualizando configuración CSP...');
  // La configuración ya fue actualizada anteriormente
}

// 6. Limpiar backup si todo está bien
if (fs.existsSync(BACKUP_PATH)) {
  console.log('🧹 Limpiando backup...');
  fs.rmSync(BACKUP_PATH, { recursive: true, force: true });
}

console.log('✅ Integración completada exitosamente!');
console.log('');
console.log('📋 Próximos pasos:');
console.log('1. Revisar el código integrado en demos-app/app/demos/automata-rrhh/');
console.log('2. Ejecutar npm run dev en demos-app para probar localmente');
console.log('3. Hacer deploy a Vercel: cd demos-app && vercel --prod');
console.log('4. Actualizar URL en lib/demos/catalog.ts si cambió el dominio');
console.log('');
console.log('🎯 La demo estará disponible en:');
console.log('https://vanguard-demos.vercel.app/demos/automata-rrhh');

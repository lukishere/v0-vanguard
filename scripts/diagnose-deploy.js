// Script para diagnosticar problemas de deploy en Vercel
const { execSync } = require('child_process');

console.log('🔍 DIAGNÓSTICO DE DEPLOY - V0 VANGUARD\n');

// 1. Verificar variables de entorno críticas
console.log('📋 1. VERIFICACIÓN DE VARIABLES DE ENTORNO:');
const requiredEnvVars = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'NEXT_PUBLIC_CLERK_SIGN_IN_URL',
  'NEXT_PUBLIC_CLERK_SIGN_UP_URL'
];

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName}: NO CONFIGURADO`);
  } else if (value.includes('your_') || value.includes('pk_test_YOUR') || value.includes('sk_test_YOUR')) {
    console.log(`⚠️  ${varName}: PLACEHOLDER DETECTADO`);
  } else if (value.startsWith('pk_test_') || value.startsWith('sk_test_')) {
    console.log(`✅ ${varName}: CONFIGURADO (test key)`);
  } else {
    console.log(`✅ ${varName}: CONFIGURADO`);
  }
});

// 2. Verificar archivos críticos
console.log('\n📁 2. VERIFICACIÓN DE ARCHIVOS CRÍTICOS:');
const criticalFiles = [
  'package.json',
  'next.config.mjs',
  'app/layout.tsx',
  'lib/firebase.ts'
];

criticalFiles.forEach(file => {
  try {
    require('fs').accessSync(file);
    console.log(`✅ ${file}: EXISTE`);
  } catch {
    console.log(`❌ ${file}: NO ENCONTRADO`);
  }
});

// 3. Verificar dependencias críticas
console.log('\n📦 3. VERIFICACIÓN DE DEPENDENCIAS CRÍTICAS:');
try {
  const packageJson = JSON.parse(require('fs').readFileSync('package.json', 'utf8'));
  const criticalDeps = [
    '@clerk/nextjs',
    'next',
    'react',
    'firebase'
  ];

  criticalDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep}: NO ENCONTRADO`);
    }
  });
} catch (error) {
  console.log('❌ Error leyendo package.json:', error.message);
}

// 4. Verificar configuración de build
console.log('\n🔨 4. VERIFICACIÓN DE BUILD:');
try {
  console.log('Ejecutando build de prueba...');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Build exitoso');
} catch (error) {
  console.log('❌ Build falló:', error.message);
}

// 5. Diagnóstico de posibles problemas de Clerk
console.log('\n🔐 5. DIAGNÓSTICO DE CLERK:');
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (clerkKey) {
  if (clerkKey.includes('clerk.accounts.dev')) {
    console.log('✅ Clerk: Usando dominio de desarrollo');
  } else {
    console.log('⚠️  Clerk: Posible dominio de producción requerido');
  }

  // Verificar formato de la key
  if (clerkKey.startsWith('pk_test_')) {
    console.log('✅ Clerk: Key de test válida');
  } else if (clerkKey.startsWith('pk_live_')) {
    console.log('✅ Clerk: Key de producción válida');
  } else {
    console.log('❌ Clerk: Formato de key inválido');
  }
} else {
  console.log('❌ Clerk: Key no configurada');
}

console.log('\n🏁 DIAGNÓSTICO COMPLETADO');
console.log('\n💡 RECOMENDACIONES:');
console.log('1. Asegúrate de que las variables de entorno estén configuradas en Vercel');
console.log('2. Verifica que las claves de Clerk sean válidas para tu proyecto');
console.log('3. Confirma que el dominio de Vercel esté autorizado en Clerk Dashboard');
console.log('4. Revisa los logs de Vercel para errores específicos');

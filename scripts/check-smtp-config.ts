/**
 * Script to check SMTP configuration
 * Run with: npx tsx scripts/check-smtp-config.ts
 *
 * Note: This script checks environment variables directly.
 * Make sure .env.local is loaded by Next.js or set variables manually.
 */

console.log('🔍 Checking SMTP Configuration...\n');

const requiredVars = [
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS',
];

const optionalVars = [
  'SMTP_PORT',
];

let hasErrors = false;

// Check required variables
console.log('📋 Required Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value === 'your_' + varName.toLowerCase().replace(/_/g, '_') || value.includes('your_')) {
    console.log(`  ❌ ${varName}: Missing or not configured`);
    hasErrors = true;
  } else {
    // Mask sensitive values
    const masked = varName.includes('PASS')
      ? '*'.repeat(Math.min(value.length, 8))
      : value.length > 50
        ? value.substring(0, 47) + '...'
        : value;
    console.log(`  ✅ ${varName}: ${masked}`);
  }
});

// Check optional variables
console.log('\n📋 Optional Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`  ⚠️  ${varName}: Not set (will use default: 587)`);
  } else {
    console.log(`  ✅ ${varName}: ${value}`);
  }
});

// Check email destination
console.log('\n📧 Email Configuration:');
const toEmail = 'lucas.ballestero@gmail.com';
console.log(`  📬 Destination: ${toEmail}`);
console.log(`  📤 From: ${process.env.SMTP_USER || 'Not configured'}`);

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ SMTP Configuration: INCOMPLETE');
  console.log('\n💡 Next Steps:');
  console.log('  1. Create or update .env.local file');
  console.log('  2. Add the required SMTP variables:');
  requiredVars.forEach(varName => {
    console.log(`     ${varName}=your_value_here`);
  });
  console.log('\n  3. For Gmail, you may need to:');
  console.log('     - Enable 2-factor authentication');
  console.log('     - Generate an App Password');
  console.log('     - Use the App Password in SMTP_PASS');
} else {
  console.log('✅ SMTP Configuration: READY');
  console.log('\n💡 To test SMTP connection, try submitting the audit form.');
}

console.log('\n');

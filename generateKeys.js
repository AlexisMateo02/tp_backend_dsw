import crypto from 'crypto'

console.log('\n🔑 Claves generadas para tu .env:\n')
console.log(`SECRET_KEY=${crypto.randomBytes(32).toString('hex')}`)
console.log(`SECRET_EMAIL_KEY=${crypto.randomBytes(32).toString('hex')}`)
console.log(`SECRET_PASSWORD_KEY=${crypto.randomBytes(32).toString('hex')}`)
console.log('')
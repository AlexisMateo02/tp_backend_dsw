// src/shared/dataBase/seeders/user.seeder.ts
import { orm } from './orm.js'
import { User, UserRole } from '../../user/user.entity.js'
import * as bcrypt from 'bcrypt'

export async function seedAdminUser() {
  const entityManager = orm.em

  try {
    // Verificar si ya existe un usuario admin
    const existingAdmin = await entityManager.findOne(User, { 
      email: 'admin@gmail.com' 
    })

    if (existingAdmin) {
      console.log('✅ El usuario admin ya existe en la base de datos')
      return
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash('123456', 10)

    // Crear el usuario admin
    const adminUser = entityManager.create(User, {
      firstName: 'Administrador',
      lastName: 'Del Sistema',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    })

    await entityManager.persistAndFlush(adminUser)
    console.log('✅ Usuario admin creado exitosamente:')
    console.log('   Email: admin@gmail.com')
    console.log('   Contraseña: 123456')
    console.log('   Rol: ADMIN')

  } catch (error) {
    console.error('❌ Error al crear el usuario admin:', error)
  }
}
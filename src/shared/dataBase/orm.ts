import { MikroORM } from '@mikro-orm/core'
import { MySqlDriver } from '@mikro-orm/mysql'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { config } from '../../config.js'
import { User, UserRole } from '../../user/user.entity.js'
import * as bcrypt from 'bcrypt'

export const orm = await MikroORM.init({
	entities: ['dist/**/*.entity.js'],
	entitiesTs: ['src/**/*.entity.ts'],
	dbName: config.db.name,
	driver: MySqlDriver,

	host: config.db.host,
	port: config.db.port,
	user: config.db.user,
	password: config.db.password,

	highlighter: new SqlHighlighter(),
	debug: config.isDevelopment,

	// ✅ AGREGAR ESTA CONFIGURACIÓN PARA PERMITIR CONTEXTO GLOBAL
	allowGlobalContext: true,

	// metadataProvider: TsMorphMetadataProvider,

	// Configuración del ORM para generar el esquema en la BD
	schemaGenerator: {
		disableForeignKeys: true,
		createForeignKeyConstraints: true,
		ignoreSchema: [],
	},

	// Configuraciones MySQL
	charset: 'utf8mb4',
	collate: 'utf8mb4_unicode_ci',
})

export const syncSchema = async () => {
	if (config.isProduction) {
		console.warn('❌ syncSchema() no debería usarse en producción')
		return
	}

	try {
		const generator = orm.getSchemaGenerator()
		await generator.updateSchema()
		console.log('✅ Schema sincronizado')

		// ✅ CREAR USUARIO ADMIN AUTOMÁTICAMENTE
		await seedAdminUser()
	} catch (error) {
		console.error('❌ Error sincronizando schema:', error)
	}
}

// ✅ FUNCIÓN PARA CREAR EL USUARIO ADMIN (VERSIÓN CORREGIDA)
async function seedAdminUser() {
	// ✅ CREAR UN FORK DEL ENTITY MANAGER
	const forkedEm = orm.em.fork()

	try {
		console.log('🔍 Verificando si existe usuario admin...')
		
		// Verificar si ya existe un usuario admin usando el fork
		const existingAdmin = await forkedEm.findOne(User, { 
			email: 'admin@gmail.com' 
		})

		if (existingAdmin) {
			console.log('✅ El usuario admin ya existe en la base de datos')
			return existingAdmin
		}

		// Hashear la contraseña
		const hashedPassword = await bcrypt.hash('123456', 10)

		// Crear el usuario admin usando el fork
		const adminUser = forkedEm.create(User, {
			firstName: 'Administrador',
			lastName: 'Del Sistema',
			email: 'admin@gmail.com',
			password: hashedPassword,
			role: UserRole.ADMIN,
		})

		await forkedEm.persistAndFlush(adminUser)
		console.log('✅ Usuario admin creado exitosamente:')
		console.log('   📧 Email: admin@gmail.com')
		console.log('   🔑 Contraseña: 123456')
		console.log('   👑 Rol: ADMIN')

		return adminUser

	} catch (error) {
		console.error('❌ Error al crear el usuario admin:', error)
		throw error
	}
}
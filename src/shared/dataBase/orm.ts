import { MikroORM } from '@mikro-orm/core'
import { MySqlDriver } from '@mikro-orm/mysql'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection' 
import { config } from '../../config.js'

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

	metadataProvider: TsMorphMetadataProvider,

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
	} catch (error) {
		console.error('❌ Error sincronizando schema:', error)
	}
}
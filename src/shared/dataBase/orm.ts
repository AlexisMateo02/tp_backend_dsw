import { MikroORM } from '@mikro-orm/core'
import { MySqlDriver } from '@mikro-orm/mysql'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { config } from '../../config.js'

export const orm = await MikroORM.init({
	//TODO: Configuración básica del ORM
	entities: ['dist/**/*.entity.js'],
	entitiesTs: ['src/**/*.entity.ts'],
	dbName: config.db.name,
	driver: MySqlDriver,
	clientUrl: config.db.url,
	highlighter: new SqlHighlighter(),
	debug: config.isDevelopment,

	//TODO Configuración del ORM para generar el esquema en la BD
	schemaGenerator: {
		//! Utilizar solo para el desarrollo; nunca en producción
		disableForeignKeys: true,
		createForeignKeyConstraints: true,
		ignoreSchema: [],
	},
})

export const syncSchema = async () => {
	if (config.isProduction) {
		console.warn('syncSchema() no debería usarse en producción')
		return
	}
	const generator = orm.getSchemaGenerator()
	// await generator.dropSchema()
	// await generator.createSchema()
	await generator.updateSchema()
	console.log('Schema sincronizado')
}

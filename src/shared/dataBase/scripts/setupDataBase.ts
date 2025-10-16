import mysql, { Connection } from 'mysql2/promise'
import { config } from '../../../config.js'

const setupDatabase = async (): Promise<void> => {
	let connection: Connection | null = null

	try {
		console.log('Conectando a MySQL como administrador...')

		if (!config.mysqlRoot.user || !config.mysqlRoot.password) {
			throw new Error('MYSQL_ROOT_USER y MYSQL_ROOT_PASSWORD son requeridos')
		}

		connection = await mysql.createConnection({
			host: config.db.host,
			port: config.db.port,
			user: config.mysqlRoot.user,
			password: config.mysqlRoot.password,
		})

		console.log('Conexión establecida')

		// Crear base de datos de desarrollo
		await connection.execute(`CREATE DATABASE IF NOT EXISTS ${config.db.name}`)
		console.log(`Base de datos "${config.db.name}" creada/verificada`)

		// Crear base de datos de testing (si está configurada)
		if (config.db.testUrl) {
			const testDbName = config.db.testUrl.split('/').pop()?.split('?')[0]
			await connection.execute(`CREATE DATABASE IF NOT EXISTS ${testDbName}`)
			console.log(`Base de datos de testing "${testDbName}" creada/verificada`)
		}

		// Crear usuario
		await connection.execute(`CREATE USER IF NOT EXISTS '${config.db.user}'@'%' IDENTIFIED BY '${config.db.password}'`)
		console.log(`Usuario "${config.db.user}" creado/verificado`)

		// Otorgar permisos
		await connection.execute(`GRANT ALL PRIVILEGES ON ${config.db.name}.* TO '${config.db.user}'@'%'`)

		if (config.db.testUrl) {
			const testDbName = config.db.testUrl.split('/').pop()?.split('?')[0]
			await connection.execute(`GRANT ALL PRIVILEGES ON ${testDbName}.* TO '${config.db.user}'@'%'`)
		}

		await connection.execute('FLUSH PRIVILEGES')
		console.log('Privilegios otorgados y actualizados')

		console.log('\nConfiguración de base de datos completada exitosamente')
	} catch (error) {
		console.error('Error configurando la base de datos:', error)
		process.exit(1)
	} finally {
		if (connection) {
			await connection.end()
			console.log('Conexión cerrada')
		}
	}
}

setupDatabase()

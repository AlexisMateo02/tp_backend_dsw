import mysql, { Connection } from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

interface DataBaseConfig {
	host: string
	port: number
	user: string | undefined
	password: string | undefined
}

interface DataBaseError extends Error {
	code?: string
}

const setupDataBase = async (): Promise<void> => {
	let connection: Connection | null = null

	try {
		console.log('Conectando a MySQL como administrador...')

		const config: DataBaseConfig = {
			host: process.env.DB_HOST || 'localhost',
			port: parseInt(process.env.DB_PORT || '3306', 10),
			user: process.env.MYSQL_ROOT_USER,
			password: process.env.MYSQL_ROOT_PASSWORD,
		}

		connection = await mysql.createConnection(config)

		console.log('Conexión establecida')

		const dbName: string | undefined = process.env.DB_NAME
		const dbUser: string | undefined = process.env.DB_USER
		const dbPassword: string | undefined = process.env.DB_PASSWORD

		if (!dbName || !dbUser || !dbPassword) {
			throw new Error('Variables de entorno requeridas no están definidas: DB_NAME, DB_USER, DB_PASSWORD')
		}

		await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`)
		console.log(`Base de datos "${dbName}" creada/verificada`)

		await connection.execute(`CREATE USER IF NOT EXISTS '${dbUser}'@'%' IDENTIFIED BY '${dbPassword}'`)
		console.log(`Usuario "${dbUser}" creado/verificado`)

		await connection.execute(`GRANT ALL ON ${dbName}.* TO ${dbUser}@'%'`)
		console.log(`Permisos otorgados al usuario "${dbUser}"`)

		await connection.execute('FLUSH PRIVILEGES')
		console.log('Privilegios actualizados')

		console.log('✅ Configuración de base de datos completada exitosamente')
	} catch (error) {
		const dbError = error as DataBaseError

		console.error('❌ Error configurando la base de datos:')
		console.error(dbError.message)

		switch (dbError.code) {
			case 'ER_ACCESS_DENIED_ERROR':
				console.log('\nVerifica que:')
				console.log('   - El usuario y contraseña de root en .env sean correctos')
				console.log('   - MySQL esté ejecutándose')
				break
			case 'ECONNREFUSED':
				console.log('\nNo se pudo conectar al servidor MySQL:')
				console.log('   - Verifica que MySQL esté ejecutándose')
				console.log(`   - Verifica que el puerto ${process.env.DB_PORT || 3306} esté disponible`)
				console.log('   - Verifica que la dirección del host sea correcta')
				break
			case 'ER_NOT_SUPPORTED_AUTH_MODE':
				console.log('\nProblema de autenticación:')
				console.log('   - El método de autenticación no es compatible')
				console.log('   - Puede que necesites actualizar la contraseña del usuario usando ALTER USER')
				break
			default:
				console.log('\nVerifica que:')
				console.log('   - Todas las variables de entorno en .env estén configuradas')
				console.log('   - Tengas los permisos necesarios en MySQL')
				console.log('   - La conexión a la base de datos sea estable')
		}

		process.exit(1)
	} finally {
		if (connection) {
			await connection.end()
			console.log('Conexión cerrada')
		}
	}
}

setupDataBase()

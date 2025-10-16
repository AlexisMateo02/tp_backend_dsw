import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
	// Entorno
	NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

	// URLs
	BACKEND_URL: z.string().url().default('http://localhost:3000'),
	FRONTEND_URL: z.string().url().default('http://localhost:3001'),
	PORT: z.string().default('3000'),

	// Base de datos
	DB_HOST: z.string().default('localhost'),
	DB_PORT: z.string().default('3306'),
	DB_NAME: z.string().min(1, 'DB_NAME es requerido'),
	DB_USER: z.string().min(1, 'DB_USER es requerido'),
	DB_PASSWORD: z.string().min(1, 'DB_PASSWORD es requerido'),

	// Base de datos de testing (opcional)
	DB_NAME_TEST: z.string().optional(),

	// Credenciales MySQL ROOT (solo para setup)
	MYSQL_ROOT_USER: z.string().optional(),
	MYSQL_ROOT_PASSWORD: z.string().optional(),

	// Claves secretas
	SECRET_KEY: z.string().min(32, 'SECRET_KEY debe tener al menos 32 caracteres'),
	SECRET_EMAIL_KEY: z.string().optional(),
	SECRET_PASSWORD_KEY: z.string().optional(),

	// Email (opcional, para futuras funcionalidades)
	EMAIL_USER: z.email().optional(),
	EMAIL_PASSWORD: z.string().optional(),
	EMAIL_FROM: z.string().optional(),

	// Admin inicial (opcional, para auto-creación)
	ADMIN_EMAIL: z.email().optional(),
	ADMIN_PASSWORD: z.string().optional(),
	ADMIN_NAME: z.string().optional(),
})

const { success, error, data } = envSchema.safeParse(process.env)

if (!success) {
	console.error('Error en las variables de entorno:')
	error.issues.forEach(err => {
		console.error(`  - ${err.path.join('.')}: ${err.message}`)
	})
	process.exit(1)
}

// Construir URL de conexión MySQL
const buildDatabaseUrl = (dbName: string): string => {
	return `mysql://${data.DB_USER}:${data.DB_PASSWORD}@${data.DB_HOST}:${data.DB_PORT}/${dbName}`
}

export const config = {
	// Entorno
	nodeEnv: data.NODE_ENV,
	isProduction: data.NODE_ENV === 'production',
	isDevelopment: data.NODE_ENV === 'development',
	isTest: data.NODE_ENV === 'test',

	// URLs
	backendUrl: data.BACKEND_URL,
	frontendUrl: data.FRONTEND_URL,
	port: parseInt(data.PORT, 10),

	// Base de datos
	db: {
		host: data.DB_HOST,
		port: parseInt(data.DB_PORT, 10),
		name: data.DB_NAME,
		user: data.DB_USER,
		password: data.DB_PASSWORD,
		url: buildDatabaseUrl(data.DB_NAME),
		testUrl: data.DB_NAME_TEST ? buildDatabaseUrl(data.DB_NAME_TEST) : null,
	},

	// MySQL ROOT (para setup)
	mysqlRoot: {
		user: data.MYSQL_ROOT_USER,
		password: data.MYSQL_ROOT_PASSWORD,
	},

	// Seguridad
	secrets: {
		key: data.SECRET_KEY,
		emailKey: data.SECRET_EMAIL_KEY,
		passwordKey: data.SECRET_PASSWORD_KEY,
	},

	// Email
	email: {
		user: data.EMAIL_USER,
		password: data.EMAIL_PASSWORD,
		from: data.EMAIL_FROM || data.EMAIL_USER,
	},

	// Admin inicial
	admin: {
		email: data.ADMIN_EMAIL,
		password: data.ADMIN_PASSWORD,
		name: data.ADMIN_NAME || 'Administrador',
	},
}

export type Config = typeof config

import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Crear directorio si no existe
const uploadDir = 'uploads/forum'
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true })
	console.log('📁 Created upload directory:', uploadDir)
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadDir)
	},
	filename: (req, file, cb) => {
		const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
		console.log('💾 Saving file as:', uniqueName)
		cb(null, uniqueName)
	},
})

export const uploadMiddleware = multer({
	storage,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB - aumenta el límite
	},
	fileFilter: (req, file, cb) => {
		console.log('🔍 File filter checking:', file.mimetype, file.originalname)

		if (file.mimetype.startsWith('image/')) {
			cb(null, true)
		} else {
			console.log('❌ File type rejected:', file.mimetype)
			cb(new Error('Solo se permiten imágenes (JPEG, PNG, etc.)'))
		}
	},
})

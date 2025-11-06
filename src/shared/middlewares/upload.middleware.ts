import multer from 'multer'
import path from 'path'
import { Request } from 'express'

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/forum/')
	},
	filename: (req, file, cb) => {
		const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
		cb(null, uniqueName)
	},
})

export const uploadMiddleware = multer({
	storage,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB límite
	},
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith('image/')) {
			cb(null, true)
		} else {
			cb(new Error('Solo se permiten imágenes'))
		}
	},
})

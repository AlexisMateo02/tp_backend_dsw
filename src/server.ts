import 'reflect-metadata'
import { app } from './app.js'
import { config } from './config.js'

const PORT = config.port

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}/`)
	console.log(`Environment: ${config.nodeEnv}`)
	console.log(`Database: ${config.db.name}`)
})

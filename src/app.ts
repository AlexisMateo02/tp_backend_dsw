import 'reflect-metadata'
import express from 'express'
import { orm, syncSchema } from './shared/dataBase/orm.js'
import { RequestContext } from '@mikro-orm/core'
import cors from 'cors'
import { config } from './config.js'

import { articleTypeRouter } from './articleType/articleType.routes.js'
import { provinceRouter } from './province/province.routes.js'
import { localtyrouter } from './localty/localty.routes.js'
import { productRouter } from './product/product.routes.js'
import { kayakTypeRouter } from './kayakType/kayakType.routes.js'
import { pickUpPointRouter } from './pickUpPoint/pickUpPoint.routes.js'

//! Middlewares globales
const app = express()
app.use(
	cors({
		origin: config.nodeEnv === 'development' ? '*' : config.frontendUrl,
		credentials: true,
	})
)
app.use(express.json())
app.use(express.static('public'))

//! Middleware para utilizar MikroORM
app.use((req, res, next) => {
	RequestContext.create(orm.em, next)
})

//! Rutas específicas de la aplicación
//? Ir agregando las rutas necesarias
app.use('/api/articleTypes', articleTypeRouter)
app.use('/api/provinces', provinceRouter)
app.use('/api/localties', localtyrouter)
app.use('/api/kayakTypes', kayakTypeRouter)
app.use('/api/products', productRouter)
app.use('/api/pickUpPoints', pickUpPointRouter)
// Rutas para Autenticación

app.use((_, res) => {
	return res.status(404).json({ message: 'Resource not found' })
})

if (config.nodeEnv === 'development') {
	await syncSchema() //! Utilizar solo para el desarrollo; nunca en producción
}

export { app }

import 'reflect-metadata'
import express from 'express'
import { orm, syncSchema } from './shared/dataBase/orm.js'
import { RequestContext } from '@mikro-orm/core'
import cors from 'cors'
import { config } from './config.js'

import { articleTypeRouter } from './articleType/articleType.routes.js'
import { provinceRouter } from './province/province.routes.js'
import { localtyrouter } from './localty/localty.routes.js'
import { kayakTypeRouter } from './kayakType/kayakType.routes.js'
import { pickUpPointRouter } from './pickUpPoint/pickUpPoint.routes.js'
import { supTypeRouter } from './supType/supType.routes.js'
import { boatTypeRouter } from './boatType/boatType.routes.js'
import { productRouter } from './product/product.routes.js'
import { orderRouter } from './order/order.routes.js'
import { reviewRouter } from './review/review.routes.js'
import { forumPublishmentRouter } from './ForumPublishment/forumPublishment.routes.js'
import { userRouter } from './user/user.routes.js'
import { authRouter } from './auth/auth.routes.js'

//! Middlewares globales
const app = express()
app.use(
	cors({
		origin: config.frontendUrl,
		credentials: true,
	})
)
app.use(express.json())
app.use(express.static('public'))

//! Middleware para utilizar MikroORM
app.use((req, res, next) => {
	RequestContext.create(orm.em, next)
})

//! Middleware para imágenes
app.use('/uploads', express.static('uploads'))

//! Rutas específicas de la aplicación
//? Ir agregando las rutas necesarias
app.use('/api/articleTypes', articleTypeRouter)
app.use('/api/provinces', provinceRouter)
app.use('/api/localties', localtyrouter)
app.use('/api/kayakTypes', kayakTypeRouter)
app.use('/api/pickUpPoints', pickUpPointRouter)
app.use('/api/supTypes', supTypeRouter)
app.use('/api/boatTypes', boatTypeRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api/forum-publishments', forumPublishmentRouter)
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)

app.use((_, res) => {
	return res.status(404).json({ message: 'Resource not found' })
})

if (config.nodeEnv === 'development') {
	await syncSchema() //! Utilizar solo para el desarrollo; nunca en producción
}

export { app }

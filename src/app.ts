import 'reflect-metadata'
import express from 'express'
import { articleTypeRouter } from './articleType/articleType.routes.js'
import { provinceRouter } from './province/province.routes.js'
import { localtyRouter } from './localty/localty.routes.js'
import { productRouter } from './product/product.routes.js'
import { kayakTypeRouter } from './kayakType/kayakType.routes.js'
import { pickUpPointRouter } from './pickUpPoint/pickUpPoint.routes.js'
import { orm, syncSchema } from './shared/dataBase/orm.js'
import { RequestContext } from '@mikro-orm/core'

//! Middleware base para utilizar Express
const app = express()
app.use(express.json())

//! Middleware para utilizar MikroORM
app.use((req, res, next) => {
	RequestContext.create(orm.em, next)
})

//! Rutas específicas de la aplicación
//? Ir agregando las rutas necesarias
app.use("/api/articleTypes", articleTypeRouter)
app.use("/api/provinces", provinceRouter)
app.use("/api/localties", localtyRouter)
app.use("/api/kayakTypes", kayakTypeRouter)
app.use("/api/products", productRouter)
app.use("/api/pickUpPoints", pickUpPointRouter)

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

await syncSchema() //! Utilizar solo para el desarrollo; nunca en producción

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000/')
})
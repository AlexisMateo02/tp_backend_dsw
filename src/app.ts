import express from "express";
import { tipoArticulorouter } from "./tipo-Articulo/tipo-Articulo.routes.js";
import { provinciarouter } from "./provincia/provincia.routes.js";

const app = express()
app.use(express.json());

app.use("/api/tipoArticulo",tipoArticulorouter)

app.use("/api/provincia", provinciarouter)

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})


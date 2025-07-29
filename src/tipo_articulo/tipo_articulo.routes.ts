import { Router } from "express";
import { sanitizeTipoArticulo, findAll, findOne, add, update, remove } from './tipo_articulo.controller.js';

export const tipoArticuloRouter = Router();

tipoArticuloRouter.get("/", findAll);
tipoArticuloRouter.get("/:id", findOne);
tipoArticuloRouter.post("/", sanitizeTipoArticulo, add);
tipoArticuloRouter.put("/:id", sanitizeTipoArticulo, update);
tipoArticuloRouter.patch("/:id", sanitizeTipoArticulo, update);
tipoArticuloRouter.delete("/:id", remove);
import { Router } from "express";
import { sanitizeTipoArticulo, findAll, findOne, add, update, remove } from './tipo-Articulo.controller';

export const tipoArticulorouter = Router();

tipoArticulorouter.get("/", findAll);
tipoArticulorouter.get("/:id", findOne);
tipoArticulorouter.post("/", sanitizeTipoArticulo, add);
tipoArticulorouter.put("/:id", sanitizeTipoArticulo, update);
tipoArticulorouter.patch("/:id", sanitizeTipoArticulo, update);
tipoArticulorouter.delete("/:id", remove);
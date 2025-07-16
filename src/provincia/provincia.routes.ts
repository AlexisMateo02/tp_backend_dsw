import { Router } from "express";
import { sanitizeProvincia, findAll, findOne, add, update, remove } from './provincia.controller';

export const provinciarouter = Router();

provinciarouter.get("/", findAll);
provinciarouter.get("/:codProv", findOne);
provinciarouter.post("/", sanitizeProvincia, add);
provinciarouter.put("/:codProv", sanitizeProvincia, update);
provinciarouter.patch("/:codProv", sanitizeProvincia, update);
provinciarouter.delete("/:codProv", remove);
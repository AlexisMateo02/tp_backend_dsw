import { Router } from "express";
import { sanitizeProvincia, findAll, findOne, add, update, remove } from './provincia.controller.js';

export const provinciaRouter = Router();

provinciaRouter.get("/", findAll);
provinciaRouter.get("/:codProv", findOne);
provinciaRouter.post("/", sanitizeProvincia, add);
provinciaRouter.put("/:codProv", sanitizeProvincia, update);
provinciaRouter.patch("/:codProv", sanitizeProvincia, update);
provinciaRouter.delete("/:codProv", remove);
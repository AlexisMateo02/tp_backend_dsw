import { Router } from "express";
import { controllerLocalty } from "./localty.controller.js";

export const localtyRouter = Router();

localtyRouter.get("/", controllerLocalty.findAll);
localtyRouter.get("/:zipcode", controllerLocalty.findOne);
localtyRouter.post("/", controllerLocalty.sanitizeLocaltyInput, controllerLocalty.add);
localtyRouter.put("/:zipcode", controllerLocalty.sanitizeLocaltyInput, controllerLocalty.update);
localtyRouter.patch("/:zipcode", controllerLocalty.sanitizeLocaltyInput, controllerLocalty.update);
localtyRouter.delete("/:zipcode", controllerLocalty.remove);
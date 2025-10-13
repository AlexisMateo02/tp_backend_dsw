import { Router } from "express";
import { controllerKayakType } from "./kayakType.controller.js";

export const kayakTypeRouter = Router();

kayakTypeRouter.get("/", controllerKayakType.findAll);
kayakTypeRouter.get("/:id", controllerKayakType.findOne);
kayakTypeRouter.get("/:id/product", controllerKayakType.getProduct);  
kayakTypeRouter.post("/", controllerKayakType.sanitizeKayakTypeInput, controllerKayakType.add);
kayakTypeRouter.put("/:id", controllerKayakType.sanitizeKayakTypeInput, controllerKayakType.update);
kayakTypeRouter.patch("/:id", controllerKayakType.sanitizeKayakTypeInput, controllerKayakType.update);
kayakTypeRouter.delete("/:id", controllerKayakType.remove);
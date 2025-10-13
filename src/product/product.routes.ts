import { Router } from "express";
import { controllerProduct } from "./product.controller.js";

export const productRouter = Router();

productRouter.get("/", controllerProduct.findAll);
productRouter.get("/:id", controllerProduct.findOne);
productRouter.post("/", controllerProduct.sanitizeProductInput, controllerProduct.add);
productRouter.put("/:id", controllerProduct.sanitizeProductInput, controllerProduct.update);
productRouter.patch("/:id", controllerProduct.sanitizeProductInput, controllerProduct.update);
productRouter.delete("/:id", controllerProduct.remove);
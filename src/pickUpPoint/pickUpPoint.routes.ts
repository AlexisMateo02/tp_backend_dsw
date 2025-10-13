import { Router } from "express";
import { controllerPickUpPoint } from "./pickUpPoint.controller.js";

export const pickUpPointRouter = Router();

pickUpPointRouter.get("/", controllerPickUpPoint.findAll);
pickUpPointRouter.get("/:id", controllerPickUpPoint.findOne);
pickUpPointRouter.post("/", controllerPickUpPoint.sanitizePickUpPointInput, controllerPickUpPoint.add);
pickUpPointRouter.put("/:id", controllerPickUpPoint.sanitizePickUpPointInput, controllerPickUpPoint.update);
pickUpPointRouter.patch("/:id", controllerPickUpPoint.sanitizePickUpPointInput, controllerPickUpPoint.update);
pickUpPointRouter.delete("/:id", controllerPickUpPoint.remove);
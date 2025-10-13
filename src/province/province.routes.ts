import { Router } from "express";
import { controllerProvince } from "./province.controller.js";

export const provinceRouter = Router();

provinceRouter.get("/", controllerProvince.findAll);
provinceRouter.get("/:id", controllerProvince.findOne);
provinceRouter.post("/", controllerProvince.sanitizeProvinceInput, controllerProvince.add);
provinceRouter.put("/:id", controllerProvince.sanitizeProvinceInput, controllerProvince.update);
provinceRouter.patch("/:id", controllerProvince.sanitizeProvinceInput, controllerProvince.update);
provinceRouter.delete("/:id", controllerProvince.remove);
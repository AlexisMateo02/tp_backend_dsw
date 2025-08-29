import { Router } from "express";
import { controllerArticleType } from "./articleType.controller.js";

export const articleTypeRouter = Router();

articleTypeRouter.get("/", controllerArticleType.findAll);
articleTypeRouter.get("/:id", controllerArticleType.findOne);
articleTypeRouter.post("/", controllerArticleType.sanitizeArticleTypeInput, controllerArticleType.add);
articleTypeRouter.put("/:id", controllerArticleType.sanitizeArticleTypeInput, controllerArticleType.update);
articleTypeRouter.patch("/:id", controllerArticleType.sanitizeArticleTypeInput, controllerArticleType.update);
articleTypeRouter.delete("/:id", controllerArticleType.remove);
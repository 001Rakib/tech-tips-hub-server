import { Router } from "express";
import { postControllers } from "./post.controller";
import auth from "../../middleware/auth";

const router = Router();
router.post("/", postControllers.createPost);

router.get("/", postControllers.getAllPost);
router.get("/:id", postControllers.getSinglePost);
router.put("/:id", auth("admin", "user"), postControllers.updatePost);
router.delete("/:id", auth("admin", "user"), postControllers.deletePost);

export const postRoutes = router;

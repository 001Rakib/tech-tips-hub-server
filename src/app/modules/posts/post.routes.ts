import { Router } from "express";
import { postControllers } from "./post.controller";
import auth from "../../middleware/auth";

const router = Router();
router.post("/", postControllers.createPost);

router.get("/", postControllers.getAllPost);
router.get("/:id", postControllers.getSinglePost);
router.patch("/:id", auth("admin", "user"), postControllers.updatePost);
router.patch("/upVote", postControllers.upVotePost);
router.patch("/downVote", postControllers.downVotePost);
router.delete("/:id", auth("admin", "user"), postControllers.deletePost);

export const postRoutes = router;

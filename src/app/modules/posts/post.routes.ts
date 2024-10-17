import { Router } from "express";
import { postControllers } from "./post.controller";

const router = Router();
router.post("/", postControllers.createPost);

router.get("/", postControllers.getAllPost);
router.get("/:id", postControllers.getSinglePost);
router.patch("/upVote", postControllers.upVotePost);
router.patch("/downVote", postControllers.downVotePost);
router.patch("/:id", postControllers.updatePost);
router.delete("/:id", postControllers.deletePost);

export const postRoutes = router;

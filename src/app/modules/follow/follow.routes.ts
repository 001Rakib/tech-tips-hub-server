import { Router } from "express";
import { followControllers } from "./follow.controller";

const router = Router();

router.get("/", followControllers.userToFollow);
router.patch("/", followControllers.followUser);

export const followRoutes = router;

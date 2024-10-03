import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { postControllers } from "./post.controller";
import auth from "../../middleware/auth";
import { postValidationSchema } from "./post.validation";

const router = Router();
router.post(
  "/",
  validateRequest(postValidationSchema.createPostValidationSchema),
  postControllers.createPost
);

router.get("/", postControllers.getAllPost);
router.get("/:id", postControllers.getSingleCar);
router.put(
  "/:id",
  auth("admin"),
  validateRequest(postValidationSchema.updatePostValidationSchema),
  postControllers.updateCar
);
router.delete("/:id", auth("admin"), postControllers.deleteCar);

export const postRoutes = router;

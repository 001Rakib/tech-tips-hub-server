import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { carValidationSchema } from "./car.validation";
import { carControllers } from "./car.controller";
import auth from "../../middleware/auth";

const router = Router();
router.post(
  "/",
  auth("admin"),
  validateRequest(carValidationSchema.createCarValidationSchema),
  carControllers.createCar
);
router.put("/return", auth("admin"), carControllers.returnCar);

router.get("/", carControllers.getAllCar);
router.get("/:id", carControllers.getSingleCar);
router.put(
  "/:id",
  auth("admin"),
  validateRequest(carValidationSchema.updateCarValidationSchema),
  carControllers.updateCar
);
router.delete("/:id", auth("admin"), carControllers.deleteCar);

export const carRoutes = router;

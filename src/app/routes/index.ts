import { Router } from "express";
import { UserRoutes } from "../modules/users/user.routes";
import { followRoutes } from "../modules/follow/follow.routes";
import { paymentRoute } from "../modules/payment/payment.route";
import { postRoutes } from "../modules/posts/post.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: UserRoutes,
  },
  {
    path: "/posts",
    route: postRoutes,
  },
  {
    path: "/follow",
    route: followRoutes,
  },
  {
    path: "/payment",
    route: paymentRoute,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;

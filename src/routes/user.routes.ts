import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/notifications", userController.getMyNotifications);
router.patch("/notifications/:notificationId/read", userController.markRead);
router.patch("/notifications/read-all", userController.markAllRead);
router.get("/search", userController.searchUsers);

export default router;

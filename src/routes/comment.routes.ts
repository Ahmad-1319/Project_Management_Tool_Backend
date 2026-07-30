import { Router } from "express";
import * as commentController from "../controllers/comment.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/task/:taskId", commentController.addComment);
router.get("/task/:taskId", commentController.getTaskComments);
router.delete("/:commentId", commentController.deleteComment);

export default router;

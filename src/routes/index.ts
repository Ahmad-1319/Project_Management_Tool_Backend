import { Router } from "express";
import authRoutes from "./auth.routes.js";
import projectRoutes from "./project.routes.js";
import taskRoutes from "./task.routes.js";
import commentRoutes from "./comment.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/comments", commentRoutes);
router.use("/users", userRoutes);

export default router;

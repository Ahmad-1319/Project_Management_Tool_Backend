import { Router } from "express";
import * as taskController from "../controllers/task.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema } from "../validators/task.validator.js";

const router = Router();

router.use(authenticate);

router.post("/", validate(createTaskSchema), taskController.createTask);
router.get("/project/:projectId", taskController.getProjectTasks);
router.get("/:taskId", taskController.getTask);
router.patch("/:taskId", validate(updateTaskSchema), taskController.updateTask);
router.patch("/:taskId/status", validate(updateTaskStatusSchema), taskController.updateTaskStatus);
router.delete("/:taskId", taskController.deleteTask);

export default router;

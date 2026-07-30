import { Router } from "express";
import * as projectController from "../controllers/project.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createProjectSchema, updateProjectSchema, addMemberSchema } from "../validators/project.validator.js";

const router = Router();

router.use(authenticate);

router.get("/", projectController.getMyProjects);
router.post("/", validate(createProjectSchema), projectController.createProject);

router.get("/:projectId", projectController.getProject);
router.patch("/:projectId", validate(updateProjectSchema), projectController.updateProject);
router.delete("/:projectId", projectController.deleteProject);

router.post("/:projectId/members", validate(addMemberSchema), projectController.addMember);
router.delete("/:projectId/members/:memberId", projectController.removeMember);

export default router;

import { Router } from "express";
import { schoolingController } from "./schoolingController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Fonoaudiólogo/a"]), schoolingController.getAllSchoolings);
router.get("/:id", auth, role(["Fonoaudiólogo/a"]), schoolingController.getSchoolingById);
router.post("/", auth, role(["Fonoaudiólogo/a"]), schoolingController.createSchooling);
router.patch("/entrevista/:interviewId", auth, role(["Fonoaudiólogo/a"]), schoolingController.updateByInterview);
router.delete("/:id", auth, role(["Fonoaudiólogo/a"]), schoolingController.deleteSchooling);

export const schoolingRoutes = router;

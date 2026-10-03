import { Router } from "express";
import { schoolingController } from "./schoolingController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Psicólogo/a"]), schoolingController.getAllSchoolings);
router.get("/:id", auth, role(["Psicólogo/a"]), schoolingController.getSchoolingById);
router.post("/", auth, role(["Psicólogo/a"]), schoolingController.createSchooling);
router.patch("/entrevista/:interviewId", auth, role(["Psicólogo/a"]), schoolingController.updateByInterview);
router.delete("/:id", auth, role(["Psicólogo/a"]), schoolingController.deleteSchooling);

export const schoolingRoutes = router;

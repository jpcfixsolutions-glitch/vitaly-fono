import { Router } from "express";
import { firstInterviewController } from "./firstInterviewController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Psicólogo/a"]), firstInterviewController.getAllFirstInterviews);
router.get("/:id", auth, role(["Psicólogo/a"]), firstInterviewController.getFirstInterviewById);
router.get("/paciente/:patientId", auth, role(["Psicólogo/a"]), firstInterviewController.getFirstInterviewByPatientId);
router.get("/usuario/:id_user", auth, role(["Psicólogo/a"]), firstInterviewController.getAllFirstInterviewsByUserId);
router.post("/", auth, role(["Psicólogo/a"]), firstInterviewController.createFirstInterview);
router.put("/:id", auth, role(["Psicólogo/a"]), firstInterviewController.updateFirstInterview);

export const firstInterviewRoutes = router;
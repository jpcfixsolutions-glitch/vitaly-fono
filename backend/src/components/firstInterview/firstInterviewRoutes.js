import { Router } from "express";
import { firstInterviewController } from "./firstInterviewController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Fonoaudiólogo/a"]), firstInterviewController.getAllFirstInterviews);
router.get("/:id", auth, role(["Fonoaudiólogo/a"]), firstInterviewController.getFirstInterviewById);
router.get("/paciente/:patientId", auth, role(["Fonoaudiólogo/a"]), firstInterviewController.getFirstInterviewByPatientId);
router.get("/usuario/:id_user", auth, role(["Fonoaudiólogo/a"]), firstInterviewController.getAllFirstInterviewsByUserId);
router.post("/", auth, role(["Fonoaudiólogo/a"]), firstInterviewController.createFirstInterview);
router.put("/:id", auth, role(["Fonoaudiólogo/a"]), firstInterviewController.updateFirstInterview);

export const firstInterviewRoutes = router;

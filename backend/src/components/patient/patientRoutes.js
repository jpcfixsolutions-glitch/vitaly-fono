import { Router } from "express";
import { patientController } from "./patientController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Fonoaudiólogo/a", "Recepción"]), patientController.getAllPatients);
router.get("/search", auth, role(["Fonoaudiólogo/a", "Recepción"]), patientController.searchPatients);
router.get("/:id", auth, role(["Fonoaudiólogo/a", "Recepción"]), patientController.getPatientById);
router.get("/:id_document_type/:document_number", auth, role(["Fonoaudiólogo/a", "Recepción"]), patientController.getPatientByDocumentAndDocumentType);
router.post("/", auth, role(["Fonoaudiólogo/a", "Recepción"]), patientController.createPatient);
router.patch("/:id", auth, role(["Fonoaudiólogo/a", "Recepción"]), patientController.updatePatient);
router.delete("/:id", auth, role(["Fonoaudiólogo/a", "Recepción"]), patientController.deactivatePatient);

export const patientRoutes = router;

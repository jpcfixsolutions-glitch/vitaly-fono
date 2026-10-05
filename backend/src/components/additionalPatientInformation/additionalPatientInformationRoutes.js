import { Router } from "express";
import { additionalPatientInformationController } from "./additionalPatientInformationController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Fonoaudiólogo/a"]), additionalPatientInformationController.getAllAdditionalPatientInformation);
router.get("/:id", auth, role(["Fonoaudiólogo/a"]), additionalPatientInformationController.getAdditionalPatientInformationById);
router.post("/", auth, role(["Fonoaudiólogo/a"]), additionalPatientInformationController.createAdditionalPatientInformation);
router.patch("/:id", auth, role(["Fonoaudiólogo/a"]), additionalPatientInformationController.updateAdditionalPatientInformation);

export const additionalPatientInformationRoutes = router;

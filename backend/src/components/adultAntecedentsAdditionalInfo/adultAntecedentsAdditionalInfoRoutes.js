import { Router } from "express";
import { adultAntecedentsAdditionalInfoController } from "./adultAntecedentsAdditionalInfoController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Psicólogo/a"]), adultAntecedentsAdditionalInfoController.getAllAdultAntecedents);
router.get("/:id", auth, role(["Psicólogo/a"]), adultAntecedentsAdditionalInfoController.getAdultAntecedentsById);
router.post("/", auth, role(["Psicólogo/a"]), adultAntecedentsAdditionalInfoController.createAdultAntecedents);
router.patch("/:id", auth, role(["Psicólogo/a"]), adultAntecedentsAdditionalInfoController.updateAdultAntecedents);

export const adultAntecedentsAdditionalInfoRoutes = router;
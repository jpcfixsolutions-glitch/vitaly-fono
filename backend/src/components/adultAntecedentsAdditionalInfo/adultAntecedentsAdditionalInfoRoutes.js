import { Router } from "express";
import { adultAntecedentsAdditionalInfoController } from "./adultAntecedentsAdditionalInfoController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Fonoaudiólogo/a"]), adultAntecedentsAdditionalInfoController.getAllAdultAntecedents);
router.get("/:id", auth, role(["Fonoaudiólogo/a"]), adultAntecedentsAdditionalInfoController.getAdultAntecedentsById);
router.post("/", auth, role(["Fonoaudiólogo/a"]), adultAntecedentsAdditionalInfoController.createAdultAntecedents);
router.patch("/:id", auth, role(["Fonoaudiólogo/a"]), adultAntecedentsAdditionalInfoController.updateAdultAntecedents);

export const adultAntecedentsAdditionalInfoRoutes = router;

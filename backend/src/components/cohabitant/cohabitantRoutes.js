import { Router } from "express";
import { cohabitantController } from "./cohabitantController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Psicólogo/a"]), cohabitantController.getAllCohabitants);
router.get("/:id", auth, role(["Psicólogo/a"]), cohabitantController.getCohabitantById);
router.post("/", auth, role(["Psicólogo/a"]), cohabitantController.createCohabitant);
router.patch("/:id", auth, role(["Psicólogo/a"]), cohabitantController.updateCohabitant);

export const cohabitantRoutes = router;
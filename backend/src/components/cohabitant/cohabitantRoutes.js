import { Router } from "express";
import { cohabitantController } from "./cohabitantController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Fonoaudiólogo/a"]), cohabitantController.getAllCohabitants);
router.get("/:id", auth, role(["Fonoaudiólogo/a"]), cohabitantController.getCohabitantById);
router.post("/", auth, role(["Fonoaudiólogo/a"]), cohabitantController.createCohabitant);
router.patch("/:id", auth, role(["Fonoaudiólogo/a"]), cohabitantController.updateCohabitant);

export const cohabitantRoutes = router;

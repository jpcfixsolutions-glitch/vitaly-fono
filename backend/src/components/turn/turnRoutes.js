import { Router } from "express";
import { turnController } from "./turnController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Fonoaudiólogo/a", "Recepción"]), turnController.getAllTurns);
router.get("/:id", auth, role(["Fonoaudiólogo/a", "Recepción"]), turnController.getTurnById);
router.post("/", auth, role(["Fonoaudiólogo/a", "Recepción"]), turnController.createTurn);
router.patch("/:id", auth, role(["Fonoaudiólogo/a", "Recepción"]), turnController.updateTurn);
router.delete("/:id", auth, role(["Fonoaudiólogo/a", "Recepción"]), turnController.deleteTurn);

export const turnRoutes = router;

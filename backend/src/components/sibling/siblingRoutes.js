import { Router } from "express";
import { siblingController } from "./siblingController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Fonoaudiólogo/a"]), siblingController.getAllSiblings);
router.get("/:id", auth, role(["Fonoaudiólogo/a"]), siblingController.getSiblingById);
router.post("/", auth, role(["Fonoaudiólogo/a"]), siblingController.createSibling);
router.patch("/:id", auth, role(["Fonoaudiólogo/a"]), siblingController.updateSibling);
router.delete("/:id", auth, role(["Fonoaudiólogo/a"]), siblingController.deleteSibling);

export const siblingRoutes = router;

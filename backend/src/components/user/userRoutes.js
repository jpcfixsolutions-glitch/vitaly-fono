import { Router } from "express";
import { userController } from "./userController.js";
import { auth, role } from "../../middlewares/index.js";

const router = Router();

router.get("/", auth, role(["Administrador", "Recepción", "Psicólogo/a"]), userController.getAllUsers);
router.get("/:id", auth, role(["Administrador"]), userController.getUserById);
router.post("/register", auth, role(["Administrador"]), userController.createUser);
router.patch("/:id", auth, role(["Administrador"]), userController.updateUser);
router.delete("/:id", auth, role(["Administrador"]), userController.deactivateUser);

export const userRoutes = router;

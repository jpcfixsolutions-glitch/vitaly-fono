import { Router } from "express";
import { paymentMethodController } from "./paymentMethodController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Psicólogo/a"]), paymentMethodController.getAllPaymentMethods);
router.get("/:id", auth, role(["Psicólogo/a"]), paymentMethodController.getPaymentMethodById);
router.post("/", auth, role(["Psicólogo/a"]), paymentMethodController.createPaymentMethod);
router.patch("/:id", auth, role(["Psicólogo/a"]), paymentMethodController.updatePaymentMethod);
router.delete("/:id", auth, role(["Psicólogo/a"]), paymentMethodController.deactivatePaymentMethod);

export const paymentMethodRoutes = router;
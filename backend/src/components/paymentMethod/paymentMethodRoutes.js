import { Router } from "express";
import { paymentMethodController } from "./paymentMethodController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Fonoaudiólogo/a"]), paymentMethodController.getAllPaymentMethods);
router.get("/:id", auth, role(["Fonoaudiólogo/a"]), paymentMethodController.getPaymentMethodById);
router.post("/", auth, role(["Fonoaudiólogo/a"]), paymentMethodController.createPaymentMethod);
router.patch("/:id", auth, role(["Fonoaudiólogo/a"]), paymentMethodController.updatePaymentMethod);
router.delete("/:id", auth, role(["Fonoaudiólogo/a"]), paymentMethodController.deactivatePaymentMethod);

export const paymentMethodRoutes = router;

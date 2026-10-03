import { Router } from "express";
import { paymentHistoryController } from "./paymentHistoryController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Psicólogo/a"]), paymentHistoryController.getAllPaymentHistory);
router.get("/:id", auth, role(["Psicólogo/a"]), paymentHistoryController.getPaymentHistoryById);
router.post("/", auth, role(["Psicólogo/a"]), paymentHistoryController.createPaymentHistory);
router.delete("/:id", auth, role(["Psicólogo/a"]), paymentHistoryController.deactivatePaymentHistory);

export const paymentHistoryRoutes = router;

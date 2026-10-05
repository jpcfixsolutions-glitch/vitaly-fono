import { Router } from "express";
import { paymentHistoryController } from "./paymentHistoryController.js";
import { auth } from "../../middlewares/auth.js";
import { role } from "../../middlewares/role.js";

const router = Router();

router.get("/", auth, role(["Fonoaudiólogo/a"]), paymentHistoryController.getAllPaymentHistory);
router.get("/:id", auth, role(["Fonoaudiólogo/a"]), paymentHistoryController.getPaymentHistoryById);
router.post("/", auth, role(["Fonoaudiólogo/a"]), paymentHistoryController.createPaymentHistory);
router.delete("/:id", auth, role(["Fonoaudiólogo/a"]), paymentHistoryController.deactivatePaymentHistory);

export const paymentHistoryRoutes = router;

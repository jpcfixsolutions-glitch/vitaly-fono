import { Router } from 'express';
import { authUserController } from './authUserController.js';

const router = Router();

router.post('/login', authUserController.loginUser);
router.post('/refresh', authUserController.refreshToken);
router.post('/logout', authUserController.logoutUser);

export const authUserRoutes = router;


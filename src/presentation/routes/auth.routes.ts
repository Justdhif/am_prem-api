import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { userAuth } from '../middlewares/userAuth.js';

const router = Router();

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get('/me', userAuth, authController.getMe.bind(authController));

export default router;

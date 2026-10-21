import { Router } from 'express';
import { billingController } from '../controllers/billing.controller.js';
import { userAuth } from '../middlewares/userAuth.js';

const router = Router();

router.get('/plans', billingController.getPlans.bind(billingController));
router.post('/subscribe', userAuth, billingController.subscribe.bind(billingController));
router.post('/regenerate-key', userAuth, billingController.regenerateKey.bind(billingController));

export default router;

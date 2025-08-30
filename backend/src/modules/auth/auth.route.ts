import { Router } from 'express';
import { handleGoogleLogin, handleGoogleCallback, profile, logout, refresh } from './auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.route('/google').get(handleGoogleLogin);
router.route('/google/callback').get(handleGoogleCallback);
router.route('/refresh').post(authMiddleware, refresh);
router.route('/logout').post(authMiddleware, logout);
router.route('/profile').get(authMiddleware, profile);

export const authRouter = router;

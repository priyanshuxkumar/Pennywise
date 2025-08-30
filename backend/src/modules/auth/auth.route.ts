import { Router } from 'express';
import { handleGoogleLogin, handleGoogleCallback } from './auth.controller';

const router = Router();

router.route('/google').get(handleGoogleLogin);

router.route('/google/callback').get(handleGoogleCallback);

export const authRouter = router;

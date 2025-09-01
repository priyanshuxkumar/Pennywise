import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { categories, summary, trends } from './analytics.controller';

const router = Router();

router.use(authMiddleware);

router.route('/summary').get(summary);
router.route('/categories').get(categories);
router.route('/trends').get(trends);

export const analyticsRouter = router;

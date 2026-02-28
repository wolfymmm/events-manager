import { Router } from 'express';
import { getUserEvents } from '../controllers/user.controller';

const router = Router();

router.get('/me/events', getUserEvents);

export default router;
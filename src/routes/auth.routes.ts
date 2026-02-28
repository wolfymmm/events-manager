import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { createEvent } from '../controllers/event.controller';
import { registerSchema } from '../schemas/auth.schema';
import { loginSchema } from '../schemas/auth.schema';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;
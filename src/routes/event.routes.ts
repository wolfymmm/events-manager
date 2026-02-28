import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { eventSchema } from '../schemas/event.schema';
import { createEvent, getEventById, updateEvent, deleteEvent, getEvents, joinEvent, leaveEvent } from '../controllers/event.controller';
import { authenticate } from '../middleware/auth.middleware';


const router = Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.patch('/:id', authenticate, validate(eventSchema), updateEvent);
router.post('/', authenticate, validate(eventSchema), createEvent);
router.delete('/:id', authenticate, deleteEvent);
router.post('/:id/join', validate(eventSchema), joinEvent);
router.post('/:id/leave', validate(eventSchema), leaveEvent);

export default router;
import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { eventSchema, updateEventSchema } from '../schemas/event.schema';
import { 
    createEvent, getEventById, updateEvent, 
    deleteEvent, getEvents, joinEvent, leaveEvent 
} from '../controllers/event.controller';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';

const router = Router();
/**
 * @swagger
 * tags:
 *   - name: Events
 *     description: Event management operations
 */


/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   location:
 *                     type: string
 *                   capacity:
 *                     type: integer
 *                   isPublic:
 *                     type: boolean
 *                   organizerId:
 *                     type: integer
 *                   _count:
 *                     type: object
 *                     properties:
 *                       participants:
 *                         type: integer
 *                   organizer:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 */
router.get('/', optionalAuthenticate, getEvents);


/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *       404:
 *         description: Event not found
 */
router.get('/:id', getEventById);


/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                type: string
 *               capacity: 
 *                 type: integer
 *     responses:
 *       201:
 *         description: Event created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, validate(eventSchema), createEvent);


/**
 * @swagger
 * /events/{id}:
 *   patch:
 *     summary: Update an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 */
router.patch('/:id', authenticate, validate(updateEventSchema), updateEvent);


/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 */
router.delete('/:id', authenticate, deleteEvent);


/**
 * @swagger
 * /events/{id}/join:
 *   post:
 *     summary: Join an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Successfully joined the event
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 */
router.post('/:id/join', authenticate, joinEvent);


/**
 * @swagger
 * /events/{id}/leave:
 *   post:
 *     summary: Leave an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Successfully left the event
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 */
router.post('/:id/leave', authenticate, leaveEvent);

export default router;
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getUserEvents } from '../controllers/user.controller';


const router = Router();

/**
 * @swagger
 * /users/me/events:
 *   get:
 *     summary: Get all events the current user is registered for
 *     description: Returns detailed information about all events the authenticated user has registered for
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of registered events retrieved successfully
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
 *       401:
 *         description: Unauthorized
 */
router.get('/me/events', authenticate, getUserEvents);

export default router;
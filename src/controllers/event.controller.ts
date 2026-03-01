import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateEventDto } from '../dtos/event.dto';
import { JoinEventDto } from '../dtos/participant.dto';

const prisma = new PrismaClient();

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const data: CreateEventDto = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user found' });
    }

    const event = await prisma.event.create({
      data: {
        ...data,
        date: new Date(data.date),

        organizer: {
          connect: { id: userId }
        }
      }
    });

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const userId = req.user?.userId; 

        let whereClause = {};

        if (!userId) {
            whereClause = { isPublic: true };
        }

        const events = await prisma.event.findMany({
            where: whereClause,
            include: {
                _count: { select: { participants: true } },
                organizer: { 
                    select: { id: true, name: true, email: true } 
                }
            },
            orderBy: { date: 'asc' }
        });

        res.json(events);
    } catch (error) {
        next(error);
    }
};

export const getEventById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const eventIdNum = Number(req.params.id);
        if (isNaN(eventIdNum)) return res.status(400).json({ message: 'Invalid ID' });

        const event = await prisma.event.findUnique({
            where: { id: eventIdNum },
            include: {
                _count: { select: { participants: true } },
                organizer: { select: { id: true, name: true, email: true } }
            }
        });

        if (!event) return res.status(404).json({ message: 'Event not found' });

        res.json(event);
    } catch (error) {
        next(error);
    }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const eventIdNum = Number(req.params.id);
        const userId = req.user?.userId;
        const data = req.body;

        const event = await prisma.event.findUnique({ where: { id: eventIdNum } });

        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.organizerId !== userId) {
            return res.status(403).json({ message: 'Forbidden: You are not the organizer of this event' });
        }

        const updatedEvent = await prisma.event.update({
            where: { id: eventIdNum },
            data: { 
                ...data,
                date: data.date ? new Date(data.date) : undefined
            }
        });

        res.json(updatedEvent);
    } catch (error) {
        next(error);
    }
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const eventIdNum = Number(req.params.id);
        const userId = req.user?.userId;

        const event = await prisma.event.findUnique({ where: { id: eventIdNum } });

        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.organizerId !== userId) {
            return res.status(403).json({ message: 'Forbidden: You can only delete your own events' });
        }

        await prisma.event.delete({ where: { id: eventIdNum } });

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const joinEvent = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const data: JoinEventDto = {
            eventId: Number(req.params.id)
        };

        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const event = await prisma.event.findUnique({
            where: { id: data.eventId },
            include: { _count: { select: { participants: true } } }
        });

        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.capacity && event._count.participants >= event.capacity) {
            return res.status(400).json({ message: 'Event is full' });
        }

        const alreadyJoined = await prisma.participant.findUnique({
            where: { 
                userId_eventsId: { 
                    userId: userId, 
                    eventsId: data.eventId 
                } 
            }
        });

        if (alreadyJoined) {
            return res.status(400).json({ message: 'You are already a participant' });
        }

        const participant = await prisma.participant.create({
            data: { 
                eventsId: data.eventId, 
                userId: userId 
            }
        });

        res.status(201).json({
            message: 'Successfully joined the event',
            participant
        });
    } catch (error) {
        next(error);
    }
};

export const leaveEvent = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const eventsIdNum = Number(req.params.id);
        const userId = req.user?.userId;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const deleted = await prisma.participant.deleteMany({
            where: { userId, eventsId: eventsIdNum }
        });

        if (deleted.count === 0) {
            return res.status(404).json({ message: 'You are not a participant of this event' });
        }

        res.json({ message: 'You have successfully left the event' });
    } catch (error: any) {
        next(error); 
    }
};
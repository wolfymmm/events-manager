import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { CreateEventDto } from '../schemas/event.schema';

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: CreateEventDto = req.body;
        
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: No user found' });
        }
        const organizerId = req.user.userId;

        const event = await prisma.event.create({ 
            data: { 
                ...data, 
                date: new Date(data.date), 
                organizerId: organizerId  
            } 
        });

        res.status(201).json(event);
    } catch (error) {
        next(error); 
    }
};

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await prisma.event.findMany({
            include: {
                _count: { select: { participants: true } },
                organizer: { select: { name: true } }
            }
        });
        res.json(events);
    } catch (error) {
        next(error);
    }
};

export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventIdNum = Number(req.params.id);
        
        const event = await prisma.event.findUnique({
            where: { id: eventIdNum },
            include: {
                _count: { select: { participants: true } },
                organizer: { select: { name: true, email: true } }
            }
        });

        if (!event) return res.status(404).json({ message: 'Event not found' });

        res.json(event);
    } catch (error) {
        next(error);
    }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventIdNum = Number(req.params.id);
        const data = req.body;

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

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventIdNum = Number(req.params.id);

        await prisma.participant.deleteMany({ where: { eventsId: eventIdNum } });
        await prisma.event.delete({ where: { id: eventIdNum } });

        res.json({ message: 'Event and all participants deleted successfully' });
    } catch (error) {
        next(error);
    }
};


export const joinEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventsIdNum = Number(req.params.id);

        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: No user found' });
        }

        const userId = req.user.userId;

        const event = await prisma.event.findUnique({
            where: { id: eventsIdNum },
            include: { _count: { select: { participants: true } } }
        });

        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.capacity && event._count.participants >= event.capacity) {
            return res.status(400).json({ message: 'Event is full' });
        }

        const participant = await prisma.participant.create({
            data: { eventsId: eventsIdNum, userId }
        });

        res.status(201).json(participant);
    } catch (error) {
        next(error);
    }
};


export const leaveEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventsIdNum = Number(req.params.id);

        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: No user found' });
        }

        const userId = req.user.userId; 

        await prisma.participant.delete({
            where: {
                userId_eventsId: {
                    userId: userId,
                    eventsId: eventsIdNum
                }
            }
        });

        res.json({ message: 'You have successfully left the event' });
    } catch (error: any) {
        next(error); 
    }
};
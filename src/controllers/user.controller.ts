import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserEvents = async (req: Request, res: Response) => {
    try {
        const userId = 4; // Тут потрібно отримати userId з токена (пізніше дороблю)
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const events = await prisma.event.findMany({
            where: {
                participants: { some: { userId } }
            },
            include: { _count: {
                select: { participants: true } 
            }, 
            organizer: {
                select: { name: true }
            }}
        });
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching user events' });
    }
};
import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserEvents = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User ID not found in token' });
        }

        const events = await prisma.event.findMany({
            where: {
                participants: {
                    some: {
                        userId: userId
                    }
                }
            },
            include: {
                _count: {
                    select: { participants: true }
                },
                organizer: {
                    select: { 
                        id: true,
                        name: true,
                        email: true 
                    }
                }
            },
            orderBy: {
                date: 'asc' 
            }
        });

        res.json(events);
    } catch (error) {
        next(error);
    }
};
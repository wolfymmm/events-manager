import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();

describe('GET /users/me/events', () => {
  let token: string;
  let userId: number;

  beforeAll(async () => {
    await prisma.participant.deleteMany();
    await prisma.event.deleteMany();
    await prisma.user.deleteMany();

    const userRes = await request(app).post('/auth/register').send({
      email: 'some_user@gmail.com',
      password: 'password123',
      name: 'Some User'
    });

    token = userRes.body.token;
    userId = userRes.body.user.id;

    const myEvent = await prisma.event.create({
      data: {
        title: 'My event',
        description: 'This is my event',
        date: new Date(Date.now() + 86400000),
        location: 'Київ',
        organizerId: userId,
        participants: {
          create: { userId: userId } 
        }
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return events where the current user is a participant', async () => {

    const otherEvent = await prisma.event.create({
      data: {
        title: 'Other event',
        description: 'This is another event',
        date: new Date(Date.now() + 172800000),
        location: 'Lviv',
        organizerId: userId, 
      }
    });

    const res = await request(app)
      .get('/users/me/events')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const eventIds = res.body.map((e: any) => e.id);

    expect(eventIds).not.toContain(otherEvent.id);
    
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('_count');
      expect(res.body[0]).toHaveProperty('organizer');
      expect(res.body[0].organizer).toHaveProperty('email');
    }
  });

  it('should return 401 if token is missing', async () => {
    const res = await request(app).get('/users/me/events');
    expect(res.statusCode).toBe(401);
  });
});
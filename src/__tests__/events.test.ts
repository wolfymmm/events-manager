import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();

describe('Events Controller Tests', () => {
  let token: string;
  let userId: number;
  let eventId: number;

  beforeAll(async () => {
    await prisma.participant.deleteMany();
    await prisma.event.deleteMany();
    await prisma.user.deleteMany();

    const userRes = await request(app).post('/auth/register').send({
      email: 'organizer@test.com',
      password: 'password123',
      name: 'Organizer'
    });

    token = userRes.body.token;
    userId = userRes.body.user.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /events', () => {
    it('should create an event when authenticated', async () => {
      const res = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Testing Workshop',
          description: 'Learn how to code',
          date: '2026-05-20T10:00:00Z',
          location: 'Online',
          capacity: 10,
          isPublic: true
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe('Testing Workshop');
      eventId = res.body.id; 
    });

    it('should return 401 if no token provided', async () => {
      const res = await request(app).post('/events').send({ title: 'No Token' });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /events', () => {
    it('should return a list of events', async () => {
      const res = await request(app).get('/events');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /events/:id/join', () => {
    it('should allow a user to join an event', async () => {
      const res = await request(app)
        .post(`/events/${eventId}/join`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(201);
      expect(res.body.participant).toHaveProperty('userId', userId)
    });

    it('should not allow joining the same event twice', async () => {
      const res = await request(app)
        .post(`/events/${eventId}/join`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('You are already a participant');
    });
  });

  describe('DELETE /events/:id', () => {
    it('should not allow deleting another user\'s event', async () => {
        const otherUser = await request(app).post('/auth/register').send({
            email: 'other@test.com',
            password: 'password123',
            name: 'Other User'
        });
        const otherToken = otherUser.body.token;

        const res = await request(app)
            .delete(`/events/${eventId}`)
            .set('Authorization', `Bearer ${otherToken}`);

        expect(res.statusCode).toBe(403); 
    });

    it('should allow the organizer to delete the event', async () => {
      const res = await request(app)
        .delete(`/events/${eventId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Event deleted successfully');
    });
  });
});
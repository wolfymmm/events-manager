import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../app';

const prisma = new PrismaClient();

describe('Auth Controller Tests', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test'
  };

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should return 400 if user already exists', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('User already exists');
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.message).toBe('Login successful');
    });

    it('should return 401 for incorrect password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrong_password'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });
  });
});
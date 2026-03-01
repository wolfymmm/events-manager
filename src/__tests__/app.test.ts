import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../app';

describe('General API Checks', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/some-random-route');
    expect(res.statusCode).toBe(404);
  });

  it('should have Swagger documentation available', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.statusCode).toBe(200);
  });
});
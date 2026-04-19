import request from 'supertest';
import { apiApp } from '../src/app';

describe('API Health Check', () => {
  it('should return 200 for health endpoint', async () => {
    const res = await request(apiApp).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});

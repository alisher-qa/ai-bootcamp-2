import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:3000';
const client = axios.create({ baseURL: BASE_URL, validateStatus: () => true });

describe('AuthService API Tests', () => {
  describe('Health Check Endpoint', () => {
    it('should return 200 with status ok', async () => {
      const res = await client.get('/health');
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('status', 'ok');
      expect(res.data).toHaveProperty('timestamp');
    });
  });

  describe('Login Endpoint - Successful Scenarios', () => {
    it('should login with valid credentials (test@test.com)', async () => {
      const res = await client.post('/login', {
        email: 'test@test.com',
        password: 'password123',
      });
      expect(res.status).toBe(200);
      expect(res.data.success).toBe(true);
      expect(res.data.message).toBe('Login successful');
      expect(res.data.user).toEqual({
        id: expect.any(Number),
        email: 'test@test.com',
        status: 'active',
      });
    });

    it('should login with valid credentials (admin@test.com)', async () => {
      const res = await client.post('/login', {
        email: 'admin@test.com',
        password: 'adminpass',
      });
      expect(res.status).toBe(200);
      expect(res.data.success).toBe(true);
      expect(res.data.user.email).toBe('admin@test.com');
    });
  });

  describe('Login Endpoint - Error Scenarios', () => {
    it('should return 401 for invalid password', async () => {
      const res = await client.post('/login', {
        email: 'test@test.com',
        password: 'wrongpassword',
      });
      expect(res.status).toBe(401);
      expect(res.data.error).toBe('Invalid email or password');
    });

    it('should return 401 for non-existent user', async () => {
      const res = await client.post('/login', {
        email: 'nonexistent@test.com',
        password: 'password123',
      });
      expect(res.status).toBe(401);
      expect(res.data.error).toBe('Invalid email or password');
    });

    it('should return 403 for blocked user', async () => {
      const res = await client.post('/login', {
        email: 'blocked@test.com',
        password: 'password123',
      });
      expect(res.status).toBe(403);
      expect(res.data.error).toBe('User account is blocked');
    });

    it('should return 400 for missing email', async () => {
      const res = await client.post('/login', {
        password: 'password123',
      });
      expect(res.status).toBe(400);
      expect(res.data.error).toBe('Email and password are required');
    });

    it('should return 400 for missing password', async () => {
      const res = await client.post('/login', {
        email: 'test@test.com',
      });
      expect(res.status).toBe(400);
      expect(res.data.error).toBe('Email and password are required');
    });

    it('should return 400 for empty email and password', async () => {
      const res = await client.post('/login', {
        email: '',
        password: '',
      });
      expect(res.status).toBe(400);
      expect(res.data.error).toBe('Email and password are required');
    });

    it('should return 400 for null email', async () => {
      const res = await client.post('/login', {
        email: null,
        password: 'password123',
      });
      expect(res.status).toBe(400);
      expect(res.data.error).toBe('Email and password are required');
    });

    it('should return 400 for null password', async () => {
      const res = await client.post('/login', {
        email: 'test@test.com',
        password: null,
      });
      expect(res.status).toBe(400);
      expect(res.data.error).toBe('Email and password are required');
    });
  });

  describe('Login Endpoint - Edge Cases', () => {
    it('should be case-sensitive for email', async () => {
      const res = await client.post('/login', {
        email: 'TEST@TEST.COM',
        password: 'password123',
      });
      expect(res.status).toBe(401);
    });

    it('should be case-sensitive for password', async () => {
      const res = await client.post('/login', {
        email: 'test@test.com',
        password: 'PASSWORD123',
      });
      expect(res.status).toBe(401);
    });

    it('should handle email with whitespace', async () => {
      const res = await client.post('/login', {
        email: ' test@test.com ',
        password: 'password123',
      });
      expect(res.status).toBe(401);
    });

    it('should handle very long email', async () => {
      const res = await client.post('/login', {
        email: 'a'.repeat(1000) + '@test.com',
        password: 'password123',
      });
      expect(res.status).toBeOneOf([400, 401]);
    });

    it('should handle very long password', async () => {
      const res = await client.post('/login', {
        email: 'test@test.com',
        password: 'p'.repeat(10000),
      });
      expect(res.status).toBeOneOf([400, 401]);
    });

    it('should reject SQL injection attempt in email', async () => {
      const res = await client.post('/login', {
        email: "test@test.com' OR '1'='1",
        password: 'password123',
      });
      expect(res.status).toBe(401);
    });

    it('should reject SQL injection attempt in password', async () => {
      const res = await client.post('/login', {
        email: 'test@test.com',
        password: "password123' OR '1'='1",
      });
      expect(res.status).toBe(401);
    });
  });

  describe('Invalid Endpoints', () => {
    it('should return 404 for unknown endpoint', async () => {
      const res = await client.get('/unknown');
      expect(res.status).toBe(404);
      expect(res.data.error).toBe('Endpoint not found');
    });

    it('should return 404 for POST to health endpoint', async () => {
      const res = await client.post('/health');
      expect(res.status).toBe(404);
    });
  });
});

// Helper to extend Jest matchers
expect.extend({
  toBeOneOf(received: any, expected: any[]) {
    const pass = expected.includes(received);
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be one of ${expected}`
          : `expected ${received} to be one of ${expected}`,
    };
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeOneOf(expected: any[]): R;
    }
  }
}

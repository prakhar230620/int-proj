const request = require('supertest');
const app = require('../index');
const User = require('../models/User');

describe('Auth & 2FA Endpoints', () => {
  let token;
  let userId;

  beforeEach(async () => {
    // Register a user to test auth flow
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    
    token = res.body.token;

    // Get the user ID
    const userRes = await request(app)
      .get('/api/auth')
      .set('x-auth-token', token);
    
    userId = userRes.body._id;
  });

  it('should authenticate a user and return token', async () => {
    const res = await request(app)
      .post('/api/auth')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body.msg).toEqual('Invalid Credentials');
  });

  it('should return a temporary token if 2FA is required', async () => {
    // Enable 2FA for the user
    await User.findByIdAndUpdate(userId, { isTwoFactorEnabled: true, twoFactorSecret: 'mock_secret' });

    const res = await request(app)
      .post('/api/auth')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('requiresTwoFactor', true);
    expect(res.body).toHaveProperty('tempToken');
  });

  it('should generate 2FA secret on setup', async () => {
    const res = await request(app)
      .post('/api/auth/setup-2fa')
      .set('x-auth-token', token);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('secret');
    expect(res.body).toHaveProperty('qrCode');
  });
});

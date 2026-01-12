
const { JwtService } = require('@nestjs/jwt');
require('dotenv').config();

async function test() {
  const jwtService = new JwtService({
    secret: process.env.JWT_SECRET || 'sung',
    signOptions: { expiresIn: '7d' }
  });

  const payload = { sub: '123', email: 'test@test.com' };
  
  try {
    const token = await jwtService.signAsync(payload, {
      secret: 'sung',
      expiresIn: '7d'
    });
    console.log('Token generated:', token);
  } catch (err) {
    console.error('Error generating token:', err);
  }
}

test();

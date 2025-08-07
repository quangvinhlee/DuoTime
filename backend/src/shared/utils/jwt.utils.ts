import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces';

export const verifyJwt = (token: string): JwtPayload => {
  const jwtService = new JwtService({
    secret: process.env.JWT_SECRET,
  });

  try {
    const payload = jwtService.verify(token);
    return payload as JwtPayload;
  } catch (error) {
    throw new Error('Invalid JWT token');
  }
};

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleLoginInput } from './dtos/auth.dto';
import { AuthResponse } from './responses/auth.response';
import { User } from '@prisma/client';
import { JwtPayload } from '../shared/interfaces';

// Mock the entire google-auth-library module
jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    verifyIdToken: jest.fn(),
  })),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: jest.Mocked<PrismaService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    googleId: 'google-123',
    name: 'Test User',
    avatarUrl: 'https://example.com/avatar.jpg',
    partnerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockJwtPayload: JwtPayload = {
    sub: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    avatarUrl: 'https://example.com/avatar.jpg',
    googleId: 'google-123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);

    // Setup default config values
    configService.get.mockImplementation((key: string) => {
      if (key === 'GOOGLE_CLIENT_ID') return 'test-client-id';
      return undefined;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return user when found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.getUser('user-1');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw error when user not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getUser('non-existent')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('renewToken', () => {
    it('should renew JWT token with 7 day expiration', async () => {
      jwtService.sign.mockReturnValue('renewed-jwt-token');

      const result = await service.renewToken(mockJwtPayload);

      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          sub: mockJwtPayload.sub,
          email: mockJwtPayload.email,
          name: mockJwtPayload.name,
          avatarUrl: mockJwtPayload.avatarUrl,
          googleId: mockJwtPayload.googleId,
        },
        {
          expiresIn: '7d',
        },
      );
      expect(result).toEqual({ token: 'renewed-jwt-token' });
    });
  });

  describe('googleLogin', () => {
    const mockGoogleLoginInput: GoogleLoginInput = {
      idToken: 'mock-id-token',
    };

    it('should handle Google OAuth verification and return token', async () => {
      // This test is simplified to avoid complex mocking issues
      // In a real scenario, you would mock the OAuth2Client properly
      jwtService.sign.mockReturnValue('mock-jwt-token');

      // Mock the OAuth2Client instance methods
      const mockOAuth2Client = {
        verifyIdToken: jest.fn().mockResolvedValue({
          getPayload: jest.fn().mockReturnValue({
            sub: 'google-123',
            email: 'test@example.com',
            name: 'Test User',
            picture: 'https://example.com/avatar.jpg',
          }),
        }),
      };

      // Replace the service's googleClient with our mock
      (service as any).googleClient = mockOAuth2Client;

      // Mock existing user found
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.googleLogin(mockGoogleLoginInput);

      expect(mockOAuth2Client.verifyIdToken).toHaveBeenCalledWith({
        idToken: 'mock-id-token',
        audience: 'test-client-id',
      });
      expect(result).toEqual({ token: 'mock-jwt-token' });
    });

    it('should create new user if user does not exist', async () => {
      const mockOAuth2Client = {
        verifyIdToken: jest.fn().mockResolvedValue({
          getPayload: jest.fn().mockReturnValue({
            sub: 'google-123',
            email: 'test@example.com',
            name: 'Test User',
            picture: 'https://example.com/avatar.jpg',
          }),
        }),
      };

      (service as any).googleClient = mockOAuth2Client;

      // Mock no existing user found
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Mock user creation
      (prismaService.user.create as jest.Mock).mockResolvedValue(mockUser);

      jwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.googleLogin(mockGoogleLoginInput);

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          googleId: 'google-123',
          email: 'test@example.com',
          name: 'Test User',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
      });
      expect(result).toEqual({ token: 'mock-jwt-token' });
    });
  });
});

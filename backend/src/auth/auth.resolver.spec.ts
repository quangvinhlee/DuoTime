import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleLoginInput } from './dtos/auth.dto';
import { AuthResponse } from './responses/auth.response';
import { UserType } from '../shared/graphql/types';
import { JwtPayload } from '../../interfaces';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: jest.Mocked<AuthService>;
  let prismaService: jest.Mocked<PrismaService>;

  const mockUser: UserType = {
    id: 'user-1',
    email: 'test@example.com',
    googleId: 'google-123',
    name: 'Test User',
    avatarUrl: 'https://example.com/avatar.jpg',
    partnerId: undefined,
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

  const mockAuthResponse: AuthResponse = {
    token: 'mock-jwt-token',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            googleLogin: jest.fn(),
            getUser: jest.fn(),
            renewToken: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get(AuthService);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('googleLogin', () => {
    const mockGoogleLoginInput: GoogleLoginInput = {
      idToken: 'mock-id-token',
    };

    it('should successfully login with Google and return auth response', async () => {
      authService.googleLogin.mockResolvedValue(mockAuthResponse);

      const result = await resolver.googleLogin(mockGoogleLoginInput);

      expect(authService.googleLogin).toHaveBeenCalledWith(
        mockGoogleLoginInput,
      );
      expect(result).toEqual(mockAuthResponse);
    });

    it('should handle errors from auth service', async () => {
      const errorMessage = 'Google login failed';
      authService.googleLogin.mockRejectedValue(new Error(errorMessage));

      await expect(resolver.googleLogin(mockGoogleLoginInput)).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile when user exists', async () => {
      authService.getUser.mockResolvedValue(mockUser as any);

      const result = await resolver.getProfile(mockJwtPayload);

      expect(authService.getUser).toHaveBeenCalledWith(mockJwtPayload.sub);
      expect(result).toEqual(mockUser);
    });

    it('should handle errors when user not found', async () => {
      const errorMessage = 'User not found';
      authService.getUser.mockRejectedValue(new Error(errorMessage));

      await expect(resolver.getProfile(mockJwtPayload)).rejects.toThrow(
        errorMessage,
      );
    });

    it('should handle JWT payload with minimal data', async () => {
      const minimalJwtPayload: JwtPayload = {
        sub: 'user-1',
        email: 'test@example.com',
        googleId: 'google-123',
      };

      authService.getUser.mockResolvedValue(mockUser as any);

      const result = await resolver.getProfile(minimalJwtPayload);

      expect(authService.getUser).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('renewToken', () => {
    it('should renew JWT token successfully', async () => {
      const renewedAuthResponse: AuthResponse = {
        token: 'renewed-jwt-token',
      };

      authService.renewToken.mockResolvedValue(renewedAuthResponse);

      const result = await resolver.renewToken(mockJwtPayload);

      expect(authService.renewToken).toHaveBeenCalledWith(mockJwtPayload);
      expect(result).toEqual(renewedAuthResponse);
    });

    it('should handle errors during token renewal', async () => {
      const errorMessage = 'Token renewal failed';
      authService.renewToken.mockRejectedValue(new Error(errorMessage));

      await expect(resolver.renewToken(mockJwtPayload)).rejects.toThrow(
        errorMessage,
      );
    });

    it('should work with JWT payload containing optional fields', async () => {
      const jwtPayloadWithOptionals: JwtPayload = {
        sub: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        avatarUrl: 'https://example.com/avatar.jpg',
        googleId: 'google-123',
      };

      authService.renewToken.mockResolvedValue(mockAuthResponse);

      const result = await resolver.renewToken(jwtPayloadWithOptionals);

      expect(authService.renewToken).toHaveBeenCalledWith(
        jwtPayloadWithOptionals,
      );
      expect(result).toEqual(mockAuthResponse);
    });
  });

  // Integration test scenarios
  describe('Integration scenarios', () => {
    it('should handle complete authentication flow', async () => {
      // Step 1: Google login
      const googleLoginInput: GoogleLoginInput = {
        idToken: 'mock-id-token',
      };

      authService.googleLogin.mockResolvedValue(mockAuthResponse);

      const loginResult = await resolver.googleLogin(googleLoginInput);
      expect(loginResult).toEqual(mockAuthResponse);

      // Step 2: Get profile using the token
      authService.getUser.mockResolvedValue(mockUser as any);

      const profileResult = await resolver.getProfile(mockJwtPayload);
      expect(profileResult).toEqual(mockUser);

      // Step 3: Renew token
      const renewedToken: AuthResponse = {
        token: 'renewed-jwt-token',
      };

      authService.renewToken.mockResolvedValue(renewedToken);

      const renewResult = await resolver.renewToken(mockJwtPayload);
      expect(renewResult).toEqual(renewedToken);
    });

    it('should handle edge cases with null/undefined values', async () => {
      const userWithNullFields: UserType = {
        ...mockUser,
        name: undefined,
        avatarUrl: undefined,
        partnerId: undefined,
      };

      authService.getUser.mockResolvedValue(userWithNullFields as any);

      const result = await resolver.getProfile(mockJwtPayload);
      expect(result).toEqual(userWithNullFields);
    });
  });
});

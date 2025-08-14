import { Test, TestingModule } from '@nestjs/testing';
import { PartnerBindingResolver } from './partner-binding.resolver';
import { PartnerBindingService } from './partner-binding.service';
import { BindingStatus } from '@prisma/client';

describe('PartnerBindingResolver', () => {
  let resolver: PartnerBindingResolver;
  let service: PartnerBindingService;

  const mockJwtUser = {
    sub: 'user-123',
    email: 'user@test.com',
    googleId: 'google-123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnerBindingResolver,
        {
          provide: PartnerBindingService,
          useValue: {
            createPartnerBinding: jest.fn(),
            acceptPartnerBinding: jest.fn(),
            rejectPartnerBinding: jest.fn(),
            removePartner: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<PartnerBindingResolver>(PartnerBindingResolver);
    service = module.get<PartnerBindingService>(PartnerBindingService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createPartnerBinding', () => {
    it('should create partner binding successfully', async () => {
      const createDto = {
        receiverId: 'receiver-456',
      };

      const mockResponse = {
        id: 'binding-123',
        invitationCode: 'TEST123',
        expiresAt: new Date().toISOString(),
        status: BindingStatus.PENDING,
      };

      jest
        .spyOn(service, 'createPartnerBinding')
        .mockResolvedValue(mockResponse as any);

      const result = await resolver.createPartnerBinding(
        mockJwtUser as any,
        createDto as any,
      );

      expect(result).toEqual(mockResponse);
      expect(service.createPartnerBinding).toHaveBeenCalledWith({
        ...createDto,
        senderId: mockJwtUser.sub,
      });
    });
  });

  describe('acceptPartnerBinding', () => {
    it('should accept partner binding successfully', async () => {
      const acceptDto = {
        invitationCode: 'TEST123',
      };

      const mockResponse = {
        id: 'binding-123',
        invitationCode: 'TEST123',
        expiresAt: new Date().toISOString(),
        status: BindingStatus.ACCEPTED,
      };

      jest
        .spyOn(service, 'acceptPartnerBinding')
        .mockResolvedValue(mockResponse as any);

      const result = await resolver.acceptPartnerBinding(
        mockJwtUser as any,
        acceptDto as any,
      );

      expect(result).toEqual(mockResponse);
      expect(service.acceptPartnerBinding).toHaveBeenCalledWith({
        ...acceptDto,
        receiverId: mockJwtUser.sub,
      });
    });
  });

  describe('rejectPartnerBinding', () => {
    it('should reject partner binding successfully', async () => {
      const rejectDto = {
        invitationCode: 'TEST123',
      };

      const mockResponse = {
        success: true,
        message: 'Binding rejected successfully',
      };

      jest
        .spyOn(service, 'rejectPartnerBinding')
        .mockResolvedValue(mockResponse as any);

      const result = await resolver.rejectPartnerBinding(
        mockJwtUser as any,
        rejectDto as any,
      );

      expect(result).toEqual(mockResponse);
      expect(service.rejectPartnerBinding).toHaveBeenCalledWith({
        ...rejectDto,
        userId: mockJwtUser.sub,
      });
    });
  });

  describe('removePartner', () => {
    it('should remove partner successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Partner removed successfully',
      };

      jest
        .spyOn(service, 'removePartner')
        .mockResolvedValue(mockResponse as any);

      const result = await resolver.removePartner(mockJwtUser as any);

      expect(result).toEqual(mockResponse);
      expect(service.removePartner).toHaveBeenCalledWith(mockJwtUser.sub);
    });
  });
});

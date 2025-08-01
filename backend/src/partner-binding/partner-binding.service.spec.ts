import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PartnerBindingService } from './partner-binding.service';
import { PrismaService } from '../prisma/prisma.service';
import { BindingStatus } from '@prisma/client';

// Mock the generateInvitationCode function
jest.mock('src/shared/utils/generateInvitationCode', () => ({
  generateInvitationCode: jest.fn(() => 'TEST123'),
}));

describe('PartnerBindingService', () => {
  let service: PartnerBindingService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnerBindingService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            partnerBinding: {
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              deleteMany: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PartnerBindingService>(PartnerBindingService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPartnerBinding', () => {
    it('should create a partner binding successfully', async () => {
      const createDto = {
        senderId: 'sender-123',
        receiverId: 'receiver-456',
      };

      const mockUser = {
        id: 'receiver-456',
        email: 'receiver@test.com',
        partnerId: null,
      };

      const mockBinding = {
        id: 'binding-123',
        invitationCode: 'TEST123',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: BindingStatus.PENDING,
      };

      // Mock the service calls
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockUser as any);
      jest
        .spyOn(prismaService.partnerBinding, 'findFirst')
        .mockResolvedValue(null);
      jest
        .spyOn(prismaService.partnerBinding, 'findUnique')
        .mockResolvedValue(null);
      jest
        .spyOn(prismaService.partnerBinding, 'create')
        .mockResolvedValue(mockBinding as any);

      const result = await service.createPartnerBinding(createDto);

      expect(result).toEqual({
        id: mockBinding.id,
        invitationCode: mockBinding.invitationCode,
        expiresAt: mockBinding.expiresAt.toISOString(),
        status: mockBinding.status,
      });
    });

    it('should throw error when senderId is missing', async () => {
      const invalidDto = { receiverId: 'receiver-456' } as any;

      await expect(service.createPartnerBinding(invalidDto)).rejects.toThrow(
        new BadRequestException('Sender ID is required'),
      );
    });
  });

  describe('acceptPartnerBinding', () => {
    it('should accept a partner binding successfully', async () => {
      const acceptDto = {
        invitationCode: 'TEST123',
        receiverId: 'receiver-456',
      };

      const mockReceiver = {
        id: 'receiver-456',
        email: 'receiver@test.com',
        partnerId: null,
      };

      const mockSender = {
        id: 'sender-123',
        email: 'sender@test.com',
        partnerId: null,
      };

      const mockBinding = {
        id: 'binding-123',
        invitationCode: 'TEST123',
        senderId: 'sender-123',
        receiverId: null,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: BindingStatus.PENDING,
      };

      const updatedBinding = { ...mockBinding, status: BindingStatus.ACCEPTED };

      // Mock the service calls
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce(mockReceiver as any)
        .mockResolvedValueOnce(mockSender as any);
      jest
        .spyOn(prismaService.partnerBinding, 'findFirst')
        .mockResolvedValue(mockBinding as any);
      jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValue([updatedBinding] as any);

      const result = await service.acceptPartnerBinding(acceptDto);

      expect(result).toEqual({
        id: updatedBinding.id,
        invitationCode: updatedBinding.invitationCode,
        expiresAt: updatedBinding.expiresAt.toISOString(),
        status: updatedBinding.status,
      });
    });
  });

  describe('rejectPartnerBinding', () => {
    it('should reject a partner binding successfully', async () => {
      const rejectDto = {
        invitationCode: 'TEST123',
        userId: 'user-123',
      };

      const mockUser = {
        id: 'user-123',
        email: 'user@test.com',
      };

      const mockBinding = {
        id: 'binding-123',
        invitationCode: 'TEST123',
        senderId: 'user-123',
        receiverId: 'receiver-456',
        status: BindingStatus.PENDING,
      };

      // Mock the service calls
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockUser as any);
      jest
        .spyOn(prismaService.partnerBinding, 'findFirst')
        .mockResolvedValue(mockBinding as any);
      jest
        .spyOn(prismaService.partnerBinding, 'delete')
        .mockResolvedValue(mockBinding as any);

      const result = await service.rejectPartnerBinding(rejectDto);

      expect(result).toEqual({
        success: true,
        message: 'Binding rejected successfully',
      });
    });
  });

  describe('removePartner', () => {
    it('should remove partner successfully', async () => {
      const userId = 'user-123';

      const mockUser = {
        id: 'user-123',
        email: 'user@test.com',
        partnerId: 'partner-456',
        partner: {
          id: 'partner-456',
          email: 'partner@test.com',
        },
      };

      // Mock the service calls
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockUser as any);
      jest.spyOn(prismaService, '$transaction').mockResolvedValue([] as any);

      const result = await service.removePartner(userId);

      expect(result).toEqual({
        success: true,
        message: 'Partner removed successfully',
      });
    });

    it('should throw error when userId is missing', async () => {
      await expect(service.removePartner('')).rejects.toThrow(
        new BadRequestException('User ID is required'),
      );
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { MemberRepository } from '../../infrastructure/repositories/member.repository';
import { Member } from '../../domain/entities/member.entity';
import { NotFoundException } from '@nestjs/common';

describe('MemberService', () => {
  let service: MemberService;
  let memberRepository: Partial<MemberRepository>;

  beforeEach(async () => {
    // Mock repository
    memberRepository = {
      findAll: jest.fn(),
      findByCode: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        { provide: MemberRepository, useValue: memberRepository },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
  });

  describe('findAll', () => {
    it('should return an array of members', async () => {
      // Arrange
      const members: Member[] = [
        Object.assign(new Member(), { code: 'M001', name: 'Angga' }),
        Object.assign(new Member(), { code: 'M002', name: 'Ferry' }),
        Object.assign(new Member(), { code: 'M003', name: 'Putri' }),
      ];
      
      memberRepository.findAll = jest.fn().mockResolvedValue(members);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toBe(members);
      expect(memberRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findByCode', () => {
    it('should return a member when a valid code is provided', async () => {
      // Arrange
      const member = Object.assign(new Member(), { 
        code: 'M001', 
        name: 'Angga',
        borrowings: []
      });
      
      memberRepository.findByCode = jest.fn().mockResolvedValue(member);

      // Act
      const result = await service.findByCode('M001');

      // Assert
      expect(result).toBe(member);
      expect(memberRepository.findByCode).toHaveBeenCalledWith('M001');
    });

    it('should throw NotFoundException when member is not found', async () => {
      // Arrange
      memberRepository.findByCode = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.findByCode('NONEXISTENT')).rejects.toThrow(NotFoundException);
      expect(memberRepository.findByCode).toHaveBeenCalledWith('NONEXISTENT');
    });
  });

  describe('create', () => {
    it('should create and return a new member', async () => {
      // Arrange
      const createMemberDto = {
        code: 'M004',
        name: 'John'
      };

      const newMember = Object.assign(new Member(), createMemberDto);
      memberRepository.save = jest.fn().mockResolvedValue(newMember);

      // Act
      const result = await service.create(createMemberDto);

      // Assert
      expect(result).toBe(newMember);
      expect(memberRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        code: 'M004',
        name: 'John'
      }));
    });
  });

  describe('update', () => {
    it('should update and return the member with the updated properties', async () => {
      // Arrange
      const existingMember = Object.assign(new Member(), {
        code: 'M001',
        name: 'Angga',
        borrowings: []
      });

      const updateMemberDto = {
        name: 'Angga Updated'
      };

      const updatedMember = Object.assign(new Member(), {
        ...existingMember,
        ...updateMemberDto
      });

      memberRepository.findByCode = jest.fn().mockResolvedValue(existingMember);
      memberRepository.update = jest.fn().mockResolvedValue(updatedMember);

      // Act
      const result = await service.update('M001', updateMemberDto);

      // Assert
      expect(result).toBe(updatedMember);
      expect(memberRepository.findByCode).toHaveBeenCalledWith('M001');
      expect(memberRepository.update).toHaveBeenCalledWith(expect.objectContaining({
        code: 'M001',
        name: 'Angga Updated'
      }));
    });

    it('should throw NotFoundException when trying to update a non-existent member', async () => {
      // Arrange
      memberRepository.findByCode = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.update('NONEXISTENT', { name: 'New Name' })).rejects.toThrow(NotFoundException);
      expect(memberRepository.findByCode).toHaveBeenCalledWith('NONEXISTENT');
      expect(memberRepository.update).not.toHaveBeenCalled();
    });
  });
});

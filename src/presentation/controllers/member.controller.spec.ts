import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from './member.controller';
import { MemberService } from '../../application/services/member.service';
import { Member } from '../../domain/entities/member.entity';
import { CreateMemberDto, UpdateMemberDto, MemberDto } from '../dtos/member.dto';
import { NotFoundException } from '@nestjs/common';
import { Borrowing } from '../../domain/entities/borrowing.entity';
import { BorrowingService } from '../../application/services/borrowing.service';

describe('MemberController', () => {
  let controller: MemberController;
  let memberService: Partial<MemberService>;
  let borrowingService: Partial<BorrowingService>;

  beforeEach(async () => {
    // Mock service
    memberService = {
      findAll: jest.fn(),
      findByCode: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    // Mock borrowing service
    borrowingService = {
      getActiveBorrowingsByMember: jest.fn(),
      borrowBook: jest.fn(),
      returnBook: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        { provide: MemberService, useValue: memberService },
        { provide: BorrowingService, useValue: borrowingService },
      ],
    }).compile();

    controller = module.get<MemberController>(MemberController);
  });

  describe('findAll', () => {
    it('should return an array of members', async () => {
      // Arrange
      const members: Member[] = [
        createMockMember('M001', 'Angga'),
        createMockMember('M002', 'Ferry'),
        createMockMember('M003', 'Putri'),
      ];
      
      // Expected DTO response
      const expectedDTOs = members.map(m => ({
        code: m.code,
        name: m.name,
        borrowedBooksCount: 0,
        isPenalized: null
      }));
      
      memberService.findAll = jest.fn().mockResolvedValue(members);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual(expectedDTOs);
      expect(memberService.findAll).toHaveBeenCalled();
    });

    it('should show information about borrowed books for each member', async () => {
      // Arrange
      const members: Member[] = [
        createMockMember('M001', 'Angga'),
        createMockMember('M002', 'Ferry'),
      ];
      
      // Create proper mock borrowings with valid dates
      const borrowingDate = new Date();
      const returnDate = new Date(borrowingDate.getTime() + (10 * 24 * 60 * 60 * 1000)); // 10 days later
      
      const mockBorrowing = new Borrowing();
      mockBorrowing.id = '1';
      mockBorrowing.book_code = 'JK-45';
      mockBorrowing.member_code = 'M001';
      mockBorrowing.borrowDate = borrowingDate;
      mockBorrowing.returnDate = returnDate;
      
      // Set up proper mocks for the borrowings and member properties
      members[0].borrowings = [mockBorrowing];
      members[1].borrowings = [];
      
      memberService.findAll = jest.fn().mockResolvedValue(members);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result.length).toBe(2);
      expect(memberService.findAll).toHaveBeenCalled();
    });
  });

  describe('findByCode', () => {
    it('should return a member when a valid code is provided', async () => {
      // Arrange
      const member = createMockMember('M001', 'Angga');
      
      // Expected DTO response
      const expectedDTO = {
        code: member.code,
        name: member.name,
        borrowedBooksCount: 0,
        isPenalized: null
      };
      
      memberService.findByCode = jest.fn().mockResolvedValue(member);

      // Act
      const result = await controller.findByCode('M001');

      // Assert
      expect(result).toEqual(expectedDTO);
      expect(memberService.findByCode).toHaveBeenCalledWith('M001');
    });

    it('should throw NotFoundException when member is not found', async () => {
      // Arrange
      memberService.findByCode = jest.fn().mockRejectedValue(new NotFoundException());

      // Act & Assert
      await expect(controller.findByCode('NONEXISTENT')).rejects.toThrow(NotFoundException);
      expect(memberService.findByCode).toHaveBeenCalledWith('NONEXISTENT');
    });
  });

  describe('create', () => {
    it('should create and return a new member', async () => {
      // Arrange
      const createMemberDto: CreateMemberDto = {
        code: 'M004',
        name: 'John'
      };

      const newMember = createMockMember('M004', 'John');
      
      // Expected DTO response
      const expectedDTO = {
        code: newMember.code,
        name: newMember.name,
        borrowedBooksCount: 0,
        isPenalized: false
      };
      
      memberService.create = jest.fn().mockResolvedValue(newMember);

      // Act
      const result = await controller.create(createMemberDto);

      // Assert
      expect(result).toEqual(expectedDTO);
      expect(memberService.create).toHaveBeenCalledWith(createMemberDto);
    });
  });

  describe('update', () => {
    it('should update and return the member with the updated properties', async () => {
      // Arrange
      const existingMember = createMockMember('M001', 'Angga');

      const updateMemberDto: UpdateMemberDto = {
        name: 'Angga Updated'
      };

      const updatedMember = createMockMember('M001', 'Angga Updated');
      
      // Expected DTO response
      const expectedDTO = {
        code: updatedMember.code,
        name: updatedMember.name,
        borrowedBooksCount: 0,
        isPenalized: null
      };

      memberService.update = jest.fn().mockResolvedValue(updatedMember);

      // Act
      const result = await controller.update('M001', updateMemberDto);

      // Assert
      expect(result).toEqual(expectedDTO);
      expect(memberService.update).toHaveBeenCalledWith('M001', updateMemberDto);
    });

    it('should throw NotFoundException when trying to update a non-existent member', async () => {
      // Arrange
      const updateMemberDto: UpdateMemberDto = {
        name: 'New Name'
      };

      memberService.update = jest.fn().mockRejectedValue(new NotFoundException());

      // Act & Assert
      await expect(controller.update('NONEXISTENT', updateMemberDto)).rejects.toThrow(NotFoundException);
      expect(memberService.update).toHaveBeenCalledWith('NONEXISTENT', updateMemberDto);
    });
  });
});

function createMockMember(code: string, name: string): Member {
  return Object.assign(new Member(), {
    code,
    name,
    borrowings: [],
    getActiveBorrowings: jest.fn().mockReturnValue([]),
    isPenalized: jest.fn().mockReturnValue(null)
  });
}

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { MemberRepository } from './member.repository';
import { Member } from '../../domain/entities/member.entity';

describe('MemberRepository', () => {
  let repository: MemberRepository;
  let typeOrmRepository: Repository<Member>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberRepository,
        {
          provide: getRepositoryToken(Member),
          useClass: Repository,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<MemberRepository>(MemberRepository);
    typeOrmRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
  });

  describe('findAll', () => {
    it('should return an array of members', async () => {
      // Arrange
      const members: Member[] = [
        Object.assign(new Member(), {
          code: 'M001',
          name: 'Angga',
          borrowings: []
        }),
        Object.assign(new Member(), {
          code: 'M002',
          name: 'Ferry',
          borrowings: []
        }),
        Object.assign(new Member(), {
          code: 'M003',
          name: 'Putri',
          borrowings: []
        }),
      ];
      
      jest.spyOn(typeOrmRepository, 'find').mockResolvedValue(members);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(result).toEqual(members);
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        relations: ['borrowings', 'borrowings.book'],
      });
    });
  });

  describe('findByCode', () => {
    it('should find a member by code', async () => {
      // Arrange
      const member = Object.assign(new Member(), {
        code: 'M001',
        name: 'Angga',
        borrowings: []
      });
      
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(member);

      // Act
      const result = await repository.findByCode('M001');

      // Assert
      expect(result).toEqual(member);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { code: 'M001' },
        relations: ['borrowings', 'borrowings.book'],
      });
    });

    it('should return null when member is not found', async () => {
      // Arrange
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(null);

      // Act
      const result = await repository.findByCode('NONEXISTENT');

      // Assert
      expect(result).toBeNull();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { code: 'NONEXISTENT' },
        relations: ['borrowings', 'borrowings.book'],
      });
    });
  });

  describe('save', () => {
    it('should save a member and return it', async () => {
      // Arrange
      const member = Object.assign(new Member(), {
        code: 'M001',
        name: 'Angga',
      });
      
      jest.spyOn(typeOrmRepository, 'save').mockResolvedValue(member);

      // Act
      const result = await repository.save(member);

      // Assert
      expect(result).toEqual(member);
      expect(typeOrmRepository.save).toHaveBeenCalledWith(member);
    });
  });

  describe('update', () => {
    it('should update a member and return it', async () => {
      // Arrange
      const member = Object.assign(new Member(), {
        code: 'M001',
        name: 'Angga Updated',
      });
      
      // Create a mock UpdateResult
      const mockUpdateResult: UpdateResult = {
        affected: 1,
        raw: {},
        generatedMaps: []
      };
      
      jest.spyOn(typeOrmRepository, 'update').mockResolvedValue(mockUpdateResult);
      jest.spyOn(repository, 'findByCode').mockResolvedValue(member);

      // Act
      const result = await repository.update(member);

      // Assert
      expect(result).toEqual(member);
      expect(typeOrmRepository.update).toHaveBeenCalledWith(
        { code: member.code }, 
        member
      );
      expect(repository.findByCode).toHaveBeenCalledWith(member.code);
    });
  });
});

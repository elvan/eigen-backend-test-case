import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberRepository } from '../../infrastructure/repositories/member.repository';
import { Member } from '../../domain/entities/member.entity';
import { CreateMemberDto } from '../../presentation/dtos/member.dto';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async findAll(): Promise<Member[]> {
    return this.memberRepository.findAll();
  }

  async findByCode(code: string): Promise<Member> {
    const member = await this.memberRepository.findByCode(code);
    if (!member) {
      throw new NotFoundException(`Member with code ${code} not found`);
    }
    return member;
  }

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const member = new Member();
    member.code = createMemberDto.code;
    member.name = createMemberDto.name;
    
    return this.memberRepository.save(member);
  }

  async update(code: string, updateMemberDto: Partial<CreateMemberDto>): Promise<Member | null> {
    const member = await this.findByCode(code);
    
    if (updateMemberDto.name) member.name = updateMemberDto.name;
    
    return this.memberRepository.update(member);
  }
}

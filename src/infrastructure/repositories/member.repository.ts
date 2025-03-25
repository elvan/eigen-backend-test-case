import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../../domain/entities/member.entity';
import { IMemberRepository } from '../../domain/repositories/member.repository.interface';

@Injectable()
export class MemberRepository implements IMemberRepository {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async findAll(): Promise<Member[]> {
    return this.memberRepository.find({
      relations: ['borrowings', 'borrowings.book'],
    });
  }

  async findByCode(code: string): Promise<Member | null> {
    return this.memberRepository.findOne({
      where: { code },
      relations: ['borrowings', 'borrowings.book'],
    });
  }

  async save(member: Member): Promise<Member> {
    return this.memberRepository.save(member);
  }

  async update(member: Member): Promise<Member | null> {
    await this.memberRepository.update({ code: member.code }, member);
    return this.findByCode(member.code);
  }
}

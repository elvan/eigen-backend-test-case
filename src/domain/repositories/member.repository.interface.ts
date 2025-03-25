import { Member } from '../entities/member.entity';

export interface IMemberRepository {
  findAll(): Promise<Member[]>;
  findByCode(code: string): Promise<Member | null>;
  save(member: Member): Promise<Member>;
  update(member: Member): Promise<Member | null>;
}

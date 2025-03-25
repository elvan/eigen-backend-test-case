import { ApiProperty } from '@nestjs/swagger';

export class MemberDto {
  @ApiProperty({ description: 'Unique member code', example: 'M001' })
  code: string;

  @ApiProperty({ description: 'Member name', example: 'Angga' })
  name: string;

  @ApiProperty({
    description: 'Number of books currently borrowed',
    example: 1,
  })
  borrowedBooksCount: number;

  @ApiProperty({
    description: 'Whether the member is currently penalized',
    example: false,
  })
  isPenalized: boolean | null;
}

export class CreateMemberDto {
  @ApiProperty({ description: 'Unique member code', example: 'M001' })
  code: string;

  @ApiProperty({ description: 'Member name', example: 'Angga' })
  name: string;
}

export class UpdateMemberDto {
  @ApiProperty({ description: 'Member name', example: 'Angga Updated', required: false })
  name?: string;
}

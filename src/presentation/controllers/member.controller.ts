import { Controller, Get, Post, Body, Param, Put, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MemberService } from '../../application/services/member.service';
import { CreateMemberDto, MemberDto } from '../dtos/member.dto';
import { BorrowingService } from '../../application/services/borrowing.service';

@ApiTags('members')
@Controller('members')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly borrowingService: BorrowingService,
  ) {}

  @ApiOperation({ summary: 'Get all members' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns all members with their borrowed books count',
    type: [MemberDto] 
  })
  @Get()
  async findAll(): Promise<MemberDto[]> {
    const members = await this.memberService.findAll();
    
    return members.map(member => ({
      code: member.code,
      name: member.name,
      borrowedBooksCount: member.getActiveBorrowings().length,
      isPenalized: member.isPenalized()
    }));
  }

  @ApiOperation({ summary: 'Get a member by code' })
  @ApiParam({ name: 'code', description: 'Member code' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns a member by code',
    type: MemberDto 
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Member not found' })
  @Get(':code')
  async findByCode(@Param('code') code: string): Promise<MemberDto> {
    const member = await this.memberService.findByCode(code);
    
    return {
      code: member.code,
      name: member.name,
      borrowedBooksCount: member.getActiveBorrowings().length,
      isPenalized: member.isPenalized(),
    };
  }

  @ApiOperation({ summary: 'Create a new member' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Member created successfully',
    type: MemberDto 
  })
  @Post()
  async create(@Body() createMemberDto: CreateMemberDto): Promise<MemberDto> {
    const member = await this.memberService.create(createMemberDto);
    
    return {
      code: member.code,
      name: member.name,
      borrowedBooksCount: 0,
      isPenalized: false
    };
  }

  @ApiOperation({ summary: 'Update a member' })
  @ApiParam({ name: 'code', description: 'Member code' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Member updated successfully',
    type: MemberDto 
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Member not found' })
  @Put(':code')
  async update(
    @Param('code') code: string, 
    @Body() updateMemberDto: Partial<CreateMemberDto>
  ): Promise<MemberDto | null> {
    const member = await this.memberService.update(code, updateMemberDto);

    if (member) {
      return {
        code: member.code,
        name: member.name,
        borrowedBooksCount: member.getActiveBorrowings().length,
        isPenalized: member.isPenalized(),
      };
    }
    return null;
  }
}

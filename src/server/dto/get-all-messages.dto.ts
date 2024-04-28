import { IsString, MaxLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllMessageDTO {
  @ApiProperty({ default: '573000000000' })
  @IsString()
  @MaxLength(255)
  phone: string;
}

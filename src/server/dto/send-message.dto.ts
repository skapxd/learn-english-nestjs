import { IsString, MaxLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDTO {
  @ApiProperty({ default: '573000000000' })
  @IsString()
  @MaxLength(255)
  readonly phone: string;

  @ApiProperty({ default: 'Hello world' })
  @IsString()
  @MaxLength(255)
  readonly message: string;
}

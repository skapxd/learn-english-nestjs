import { IsString, MaxLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

import {
  CreateEvent,
  CreateEventInterface,
} from '../shared/create-event-interface';

export class MessageSendedEvent
  extends CreateEvent
  implements CreateEventInterface
{
  static nameEvent = ['message', 'sended'];
  readonly nameEvent? = MessageSendedEvent.nameEvent;
  @ApiProperty({ default: '573000000000' })
  @IsString()
  @MaxLength(255)
  readonly phone: string;

  @ApiProperty({ default: 'Hello world' })
  @IsString()
  @MaxLength(5)
  readonly message: string;

  constructor(payload: MessageSendedEvent) {
    super(payload);
  }
}

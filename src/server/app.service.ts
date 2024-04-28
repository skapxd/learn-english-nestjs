import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { MessageSendedEvent } from './app.event';
import { GetAllMessageDTO } from './dto/get-all-messages.dto';
import { SendMessageDTO } from './dto/send-message.dto';

@Injectable()
export class AppService {
  constructor(private eventEmitter: EventEmitter2) {}

  private readonly messages = [
    {
      phone: '573000000000',
      message: 'Hello world',
    },
  ];

  async sendMessage(dto: SendMessageDTO) {
    // TODO: Implement logic here

    this.eventEmitter.emitAsync(
      MessageSendedEvent.nameEvent,
      new MessageSendedEvent({
        phone: dto.phone,
        message: dto.message,
        nameEvent: MessageSendedEvent.nameEvent.concat('x2'),
      }),
    );

    return dto;
  }

  getMessages(dto: GetAllMessageDTO) {
    return this.messages.filter((message) => {
      return message.phone === dto.phone;
    });
  }
}

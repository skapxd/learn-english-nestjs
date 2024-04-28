import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Render,
  UseGuards,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AsyncApiPub, AsyncApiSub } from 'nestjs-asyncapi';

import { CreateEventInterface } from '../shared/create-event-interface';
import { MessageSendedEvent } from './app.event';
import { AppService } from './app.service';
import { AuthorizationGuard } from './authorization/authorization.guard';
import { GetAllMessageDTO } from './dto/get-all-messages.dto';
import { SendMessageDTO } from './dto/send-message.dto';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @AsyncApiPub({
    channel: 'abc',
    message: {
      payload: MessageSendedEvent,
    },
  })
  @UseGuards(AuthorizationGuard)
  @Post()
  sendMessage(@Body() dto: SendMessageDTO) {
    return this.appService.sendMessage(dto);
  }

  @UseGuards(AuthorizationGuard)
  @Get('get-all')
  getAllMessages(@Query() query: GetAllMessageDTO) {
    return this.appService.getMessages(query);
  }

  @AsyncApiSub({
    channel: 'abc',
    message: {
      payload: SendMessageDTO,
    },
  })
  @OnEvent(MessageSendedEvent.nameEvent, { async: true })
  handleOrderCreatedEvent(payload: MessageSendedEvent) {
    return this.logger.log(payload.toString());
  }

  @OnEvent('**', { async: true })
  handleAllEvents(payload: CreateEventInterface) {
    this.logger.log('All events', payload);
    return this.logger.log(payload.toString());
  }
}

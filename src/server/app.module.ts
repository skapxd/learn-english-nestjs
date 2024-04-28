import { join } from 'node:path';

import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(process.cwd(), 'public') }),
    EventEmitterModule.forRoot({
      delimiter: '.',
      wildcard: true,
      global: true,
      verboseMemoryLeak: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

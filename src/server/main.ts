import 'dotenv/config';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { mainConfig } from '../shared/mainConfig';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const logger = new Logger(bootstrap.name);

  mainConfig(app);

  await app.listen(process.env.PORT || 3000, async () => {
    const url = await app.getUrl();
    logger.log(`Server is running in ${url}`);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();

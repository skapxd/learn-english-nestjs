import { rm, writeFile } from 'node:fs/promises';

import { ValidationError } from '@nestjs/class-validator';
import {
  INestApplication,
  PreconditionFailedException,
  ValidationPipe,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';

import { AllExceptionsHandler } from './all-exceptions-handler';
import { generateGraphOfEvents } from './generate-graph-of-events';

export async function mainConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      enableDebugMessages: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        throw new PreconditionFailedException(validationErrors);
      },
    }),
  );

  const httpRef = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new AllExceptionsHandler(httpRef.httpAdapter.getHttpServer()),
  );

  await asyncApi(app);
  await openApi(app);
}

const openApi = async (app: INestApplication) => {
  if (process.env.NODE_ENV === 'development')
    await rm('public/swagger.json').catch((e) => console.log(e));

  const config = new DocumentBuilder()
    .setTitle('NestJS example')
    .setDescription('The NestJS API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV === 'development')
    await writeFile('public/swagger.json', JSON.stringify(document, null, 2));

  // const { SwaggerTheme } = require('swagger-themes');
  // const theme = new SwaggerTheme();
  // const customCss = theme.getBuffer('dark');
  // SwaggerModule.setup('api', app, document, {
  //   customCss,
  //   explorer: true,
  // });
};

const asyncApi = async (app: INestApplication) => {
  if (process.env.NODE_ENV === 'development') {
    await rm('public/async-api.json').catch((e) => console.log(e));
    await rm('public/graph.json').catch((e) => console.log(e));
  }

  const config = new AsyncApiDocumentBuilder()
    .setTitle('Feline')
    .setDescription('Feline server description here')
    .setVersion('1.0')
    .setDefaultContentType('application/json')
    .addSecurity('user-password', { type: 'userPassword' })
    .addServer('feline-ws', {
      url: 'http://localhost:3000',
      protocol: 'http',
    })
    .build();

  const document = AsyncApiModule.createDocument(app, config);

  const graphDependencies = await generateGraphOfEvents(document);

  if (process.env.NODE_ENV === 'development') {
    await writeFile('public/async-api.json', JSON.stringify(document, null, 2));
    await writeFile(
      'public/graph.json',
      JSON.stringify(graphDependencies, null, 2),
    );
  }

  // await AsyncApiModule.setup('async-api', app, document);
};

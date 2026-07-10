import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow the deployed frontend to call this API from the browser. Defaults to
  // reflecting any origin; set FRONTEND_ORIGIN in production to lock it down.
  app.enableCors({ origin: process.env.FRONTEND_ORIGIN ?? true });

  // Hosts like Render provide PORT and require binding on 0.0.0.0.
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();

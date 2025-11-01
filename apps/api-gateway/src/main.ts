import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- CORREÇÃO CORS REVISADA ---
  app.enableCors({
    origin: 'http://localhost:5173', // Permite apenas a origem do seu front-end
    credentials: true, // Essencial para permitir requisições com 'withCredentials: true'
    // Adicionando cabeçalhos permitidos para garantir que o preflight passe
    allowedHeaders: 'Content-Type, Authorization',
  });
  // --- FIM DA CORREÇÃO CORS REVISADA ---

  await app.listen(3002);
}
bootstrap();

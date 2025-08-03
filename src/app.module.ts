import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TgModule } from './telegram/tg.module';
import { OllamaModule } from './oolama/ollama.module';

@Module({
  imports: [
    OllamaModule,
    TgModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}

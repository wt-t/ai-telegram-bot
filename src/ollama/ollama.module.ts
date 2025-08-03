import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OllamaService } from './ollama.service';

@Module({
  providers: [OllamaService],
  exports: [OllamaService]
})
export class OllamaModule {}

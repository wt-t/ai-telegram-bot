import { Module } from '@nestjs/common';
import { TgService } from './tg.service';
import { OllamaModule } from 'src/oolama/ollama.module';

@Module({
  imports: [OllamaModule],
  providers: [TgService],
  exports: [TgService]
})
export class TgModule {}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { OllamaService } from './ollama.service';
import { CreateMsgDto } from './dto/create-msg.dto';

@Controller()
export class AppController {
  constructor(private readonly ollamaService: OllamaService) {}

  @Post()
  createMsg(@Body() params: CreateMsgDto) {
    return this.ollamaService.createAsyncMessage(params.prompt);
  }
}

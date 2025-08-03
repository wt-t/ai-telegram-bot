import { Injectable, Logger } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { OllamaService } from 'src/ollama/ollama.service';

@Injectable()
export class TgService {
  private readonly bot: TelegramBot;
  private readonly logger: Logger;
  private readonly promptQueue: Set<string | number>;

  constructor(private readonly ollamaService: OllamaService) {
    this.promptQueue = new Set();
    this.logger = new Logger(TgService.name);
    const token = process.env.TG_BOT_TOKEN;
    if (!token) {
      throw new Error('TG_BOT_TOKEN MISSING !');
    }
    this.bot = new TelegramBot(token, { polling: true });
    this.bot.getMe().then((me) => this.logger.log(`BOT CONNECTED - ${JSON.stringify(me)}`));
  }

  onModuleInit() {
    this.bot.on('message', this.handleMessageEvent.bind(this));
    this.bot.onText(/\/set_model/, this.handleSetModelCommand.bind(this));
    this.bot.onText(/\/ACT_SET_MODEL/, this.handleSetModelCommand.bind(this));
    this.bot.on('callback_query', this.handleCallbackQuery.bind(this));
  }

  private async handleMessageEvent(msg: TelegramBot.Message) {
    this.logger.log(`BOT GOT THE MESSAGE ${JSON.stringify(msg)}`);
    const chatId = msg.chat.id;
    const userId = msg.from?.id;
    const prompt = msg.text;

    if (!prompt) {
      this.bot.sendMessage(chatId, 'Currently only text prompts are suported');
      return;
    }
    if (!this.isNormalMessage(prompt)) {
      return;
    }
    if (!userId) {
      this.bot.sendMessage(chatId, 'Only registered users are allowed');
      return;
    }
    if (this.promptQueue.has(userId)) {
      this.bot.sendMessage(
        chatId,
        'please wait for pervious prompt to finish, before sending next one',
      );
      return;
    }
    try {
      this.promptQueue.add(userId);
      this.bot.sendMessage(
        chatId,
        'Prompt is received, this may take a couple of minutes to process',
      );
      const aiResponse = await this.ollamaService.getAnswerSync(prompt, userId);
      this.bot.sendMessage(chatId, `Here is your answer: \n\n${aiResponse.response}`);
    } finally {
      this.promptQueue.delete(userId);
    }
  }

  private async handleSetModelCommand(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const models = await this.ollamaService.getAllModels();
    const options: TelegramBot.SendMessageOptions = {
      reply_markup: {
        inline_keyboard: [
          models.map((model) => ({
            text: model.name,
            callback_data: `ACT_SET_MODEL/${model.name}`,
          })),
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    };

    this.bot.sendMessage(chatId, 'Choose an option:', options);
  }

  private async handleCallbackQuery(query: TelegramBot.CallbackQuery) {
    const chatId = query.message?.chat.id;
    const data = query.data;

    if (!chatId || !data) {
      return;
    }
    this.ollamaService.setModel(data);
    this.bot.answerCallbackQuery(query.id, { show_alert: true, text: 'done' });
  }

  private isNormalMessage(msg: string) {
    if (msg.startsWith('\/')) {
      return false;
    }
    if (msg.includes('ACT_SET_MODEL')) {
      return false;
    }
    return true;
  }
}

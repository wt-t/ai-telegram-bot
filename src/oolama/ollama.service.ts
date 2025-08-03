import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { randomUUID } from 'crypto';

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
}

export interface Model {
  name: string;
  model: string;
  modified_at: string; // ISO 8601 date string
  size: number; // size in bytes
}

export interface ModelsResponse {
  models: Model[];
}


@Injectable()
export class OllamaService {
  private readonly logger = new Logger(OllamaService.name);
  private readonly axios: AxiosInstance;
  private model: string = 'llama3'; // <-- this should be done per user
  private msgMap = {};

  constructor() {
    this.axios = axios.create({
      timeout: 120_000,
    });
  }

  setModel(model: string) {
    this.model = model;
  }

  async createAsyncMessage(prompt: string): Promise<string> {
    const id = randomUUID();
    this.generate(prompt).then((res) => {
      this.msgMap[id] = res;
    });
    return id;
  }

  async getMessageResponse(id: string) {
    const msgResponse = this.msgMap[id];
    if (!msgResponse) {
      throw new NotFoundException(`Message not found`);
    }
    return msgResponse;
  }

  async getAnswerSync(prompt: string, id: string | number) {
    return await this.generate(prompt);
  }

  async getAllModels() {
    try {
      const res = await this.axios.get<ModelsResponse>(
        `${process.env.LLM_HOST}:${process.env.LLM_PORT}/api/tags`,
      );
      return res.data.models;
    } catch (e) {
      const msg = `Request to llm faled`;
      this.logger.error(`${msg}, ${JSON.stringify(e)}`);
      throw new InternalServerErrorException(msg, e);
    }
  }

  private async generate(prompt: string): Promise<OllamaResponse> {
    try {
      this.logger.log(`Generating with prompt: ${JSON.stringify({ prompt })}`);
      const res = await this.axios.post<OllamaResponse>(
        `${process.env.LLM_HOST}:${process.env.LLM_PORT}/api/generate`,
        { prompt, model: this.model, stream: false },
      );
      this.logger.log(
        `Llm answered with: ${JSON.stringify({ prompt, answer: res.data.response })}`,
      );
      return res.data;
    } catch (e) {
      const msg = `Request to llm faled`;
      this.logger.error(`${msg}, ${JSON.stringify(e)}`);
      throw new InternalServerErrorException(msg, e);
    }
  }
}

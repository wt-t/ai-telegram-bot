import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TgModule } from './telegram/tg.module';
import { OllamaModule } from './ollama/ollama.module';
import { DbModule } from './db/db.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    OllamaModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    DbModule,
    TgModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([User])
  ],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}

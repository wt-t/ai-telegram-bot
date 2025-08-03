// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  telegramId: number;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ default: 'en' })
  languageCode: string;

  @Column({ default: false })
  isBot: boolean;

  @Column({ default: false })
  isPremium: boolean;
}

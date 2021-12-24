import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity()
export class Watchlist extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field(() => [String])
  @Column('text', { array: true })
  items: string[];

  @Column()
  creatorId: number;

  @ManyToOne(() => User, (user) => user.watchlist, {
    onDelete: 'CASCADE',
  })
  creator: User;

  @Field(() => String)
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

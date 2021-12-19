import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// example:
//   open: 45.1,
//   high: 50.09,
//   low: 44,
//   close: 44.9,
//   volume: 117701700,
//   adjClose: 44.9,
//   symbol: 'TWTR'
@ObjectType()
@Entity()
export class Stock extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  open!: number;

  @Field()
  @Column()
  high!: number;

  @Field()
  @Column()
  low!: number;

  @Field()
  @Column()
  close!: number;

  @Field()
  @Column()
  volume: number;

  @Field()
  @Column()
  adjClose!: number;

  @Field()
  @Column({ unique: true })
  symbol!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}

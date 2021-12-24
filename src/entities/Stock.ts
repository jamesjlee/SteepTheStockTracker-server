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
  @Column({ type: 'float' })
  open!: number;

  @Field()
  @Column({ type: 'float' })
  high!: number;

  @Field()
  @Column({ type: 'float' })
  low!: number;

  @Field()
  @Column({ type: 'float' })
  close!: number;

  @Field()
  @Column({ type: 'float' })
  volume: number;

  @Field()
  @Column()
  symbol!: string;

  @Field(() => Date)
  @Column()
  recordDate!: Date;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { DDI, DDD } from '../../../constants/enums';

@Entity('phones')
export class Phone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'simple-enum',
    enum: DDI,
    default: DDI.BRA_55,
  })
  ddi: DDI;

  @Column({
    type: 'simple-enum',
    enum: DDD,
  })
  ddd: DDD;

  @Column()
  numberPhone: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.phones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


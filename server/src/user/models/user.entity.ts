import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  'createdAt': Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  'updatedAt': Date;

  @DeleteDateColumn({
    type: 'timestamptz',
  })
  'deletedAt': Date;
}

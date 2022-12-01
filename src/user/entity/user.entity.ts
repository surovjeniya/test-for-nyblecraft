import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { hash } from 'bcryptjs';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 3);
  }

  @Column({ default: '' })
  firstName: string;

  @Column({ default: '' })
  lastName: string;

  @Column({ default: '' })
  image: string;

  @Column({ default: '' })
  pdf: string;
}

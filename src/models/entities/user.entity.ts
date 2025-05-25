import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  //   ManyToMany,
  //   JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import bcrypt from 'bcryptjs';
// import { Role } from './role.entity';

const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 8);
};

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password!: string;

  @Column({ type: 'boolean', default: false })
  isEmailVerified!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  //   @ManyToMany(() => Role)
  //   @JoinTable({
  //     name: 'users_roles',
  //     joinColumn: {
  //       name: 'user_id',
  //       referencedColumnName: 'id',
  //     },
  //     inverseJoinColumn: {
  //       name: 'role_id',
  //       referencedColumnName: 'id',
  //     },
  //   })
  //   roles!: Role[];

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password) {
      this.password = await hashPassword(this.password);
    }
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    if (this.password) {
      this.password = await hashPassword(this.password);
    }
  }

  async isPasswordMatch(password: string): Promise<boolean> {
    return comparePassword(password, this.password);
  }

  toJSON() {
    const userObject = { ...this } as any;
    delete userObject.password;
    return userObject;
  }
}

export default User;

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  title!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  path!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  icon!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  component!: string;

  @Column({ type: 'int', default: 0 })
  sort!: number;

  @Column({ type: 'boolean', default: true })
  isVisible!: boolean;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'varchar', length: 36, nullable: true })
  parentId!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // 父菜单关系
  @ManyToOne(() => Menu, (menu) => menu.children)
  @JoinColumn({ name: 'parent_id' })
  parent!: Menu;

  // 子菜单关系
  @OneToMany(() => Menu, (menu) => menu.parent)
  children!: Menu[];

  // 与角色的多对多关系
  @ManyToMany(() => Role, (role) => role.menus)
  roles!: Role[];
}

export default Menu;

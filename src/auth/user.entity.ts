import { TaskEntity } from 'src/tasks/task.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
  @OneToMany((type) => TaskEntity, (task) => task.user, { eager: true })
  tasks: TaskEntity[];
}

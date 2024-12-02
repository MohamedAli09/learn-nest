// tasks.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTaskFilterDto } from './dto/get-task.filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksRepository {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async getTasks(filterDto: GetTaskFilterDto): Promise<TaskEntity[]> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder('task_entity');
    if (status) {
      query.andWhere('task_entity.status = :status', { status });
    }
    // if (search) {
    //   query.andWhere(
    //     'task_entity.title LIKE :search OR task_entity.description LIKE :search',
    //     { search: `%${search}%` },
    //   );
    // }
    //Lowercase the search string
    if (search) {
      query.andWhere(
        'LOWER(task_entity.title) LIKE LOWER(:search) OR LOWER(task_entity.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }
    return query.getMany();
  }

  // Method to create and save a new task
  async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<TaskEntity> {
    const { title, description } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.taskRepository.save(task);
    return task;
  }

  // Method to find a task by ID
  async findTaskById(id: string): Promise<TaskEntity | null> {
    return await this.taskRepository.findOne({ where: { id } });
  }

  async deleteTaskById(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<TaskEntity> {
    const { status } = updateTaskStatusDto;
    const task = await this.findTaskById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}

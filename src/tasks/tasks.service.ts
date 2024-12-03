// tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskEntity } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTaskFilterDto } from './dto/get-task.filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}
  async getTasks(
    filterDto: GetTaskFilterDto,
    user: User,
  ): Promise<TaskEntity[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<TaskEntity> {
    const found = await this.tasksRepository.findTaskById(id, user);
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<TaskEntity> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }
  async deleteTaskById(id: string, user: User): Promise<void> {
    await this.tasksRepository.deleteTaskById(id, user);
  }
  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    user: User,
  ): Promise<TaskEntity> {
    return this.tasksRepository.updateTaskStatus(id, updateTaskStatusDto, user);
  }
}

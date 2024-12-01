// tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskEntity } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTaskFilterDto } from './dto/get-task.filter.dto';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}
  async getTasks(filterDto: GetTaskFilterDto): Promise<TaskEntity[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  async getTaskById(id: string): Promise<TaskEntity> {
    const found = await this.tasksRepository.findTaskById(id);
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return this.tasksRepository.createTask(createTaskDto);
  }
  async deleteTaskById(id: string): Promise<void> {
    await this.tasksRepository.deleteTaskById(id);
  }
  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<TaskEntity> {
    return this.tasksRepository.updateTaskStatus(id, updateTaskStatusDto);
  }
}

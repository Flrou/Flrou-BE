import { Injectable } from '@nestjs/common';
import { TodoRepository } from './todo.repo';
import { Todo } from './todo.entity';

@Injectable()
export class TodoService {
  constructor(
    private readonly todoRepository: TodoRepository,
  ) {}

    async findAll(user_id: string): Promise<Todo[]> {
      return this.todoRepository.findAll(user_id);
    }

    async create(user_id: string, todo: string): Promise<string|null> {
      return this.todoRepository.create(user_id, todo);
    }

    async update(todo_id: number, new_todo: string): Promise<string|null> {
      return this.todoRepository.update(todo_id, new_todo);
    }

    async updateDone(todo_id: number): Promise<string|null> {
      return this.todoRepository.updateDone(todo_id);
    }

    async destroy(todo_id: number): Promise<string|null> {
      return this.todoRepository.destroy(todo_id);
    }
}
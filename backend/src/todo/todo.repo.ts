import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/user.entity';
import { Todo } from './todo.entity';

@Injectable()
export class TodoRepository {
  constructor(
    @InjectModel(Todo)
    private todoModel: typeof Todo,
  ) {}

  // 전체 투두 반환
  async findAll(user_id: string): Promise<Todo[]> {
    const user = await User.findOne({ where: { user_id } });
    return this.todoModel.findAll({where : {userId : user.id}});
  }

  // 투두 추가
  async create(user_id: string, todo: string): Promise<string|null> {
    const user = await User.findOne({ where: { user_id } });
    this.todoModel.create({todo: todo, isDone: false, userId: user.id});
    return 'success';
  }

  // 투두 내용 수정
  async update(todo_id: number, new_todo: string): Promise<string|null> {
    const todo = await Todo.findOne({ where: { id: todo_id }});
    if (!todo) return 'failed';
    await this.todoModel.update({ todo: new_todo, isDone: todo.isDone }, { where: { id: todo_id }});
    return 'success';
  }

  // 투두 완료여부 수정
  async updateDone(todo_id: number): Promise<string|null> {
    const todo = await Todo.findOne({ where: { id: todo_id }});
    if (!todo) return 'failed';
    await this.todoModel.update({ isDone: !todo.isDone }, { where: { id: todo_id }});
    return 'success';
  }
  
  // 투두 삭제
  async destroy(todo_id: number): Promise<string|null> {
    const result = await Todo.destroy({ where: { id: todo_id }});
    if (result === 0) return 'failed';
    return 'success';
  }
}
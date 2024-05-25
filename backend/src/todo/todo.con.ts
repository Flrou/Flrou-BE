import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // 모든 일정 조회
  @Get('getAllTodo/:user_id')
  getAllPlan(@Param('user_id') user_id: string) {
    return this.todoService.findAll(user_id);
  }

  // 일정 추가
  @Post('createTodo')
  createTodo(@Body('user_id') user_id: string, @Body('todo') todo: string) {
    return this.todoService.create(user_id, todo);
  }

  // 일정 내용 수정
  @Post('updateTodo')
  updateTodo(@Body('todo_id') todo_id: number, @Body('new_todo') new_todo: string) {
    return this.todoService.update(todo_id, new_todo);
  }

  // 일정 완료여부 수정
  @Post('updateTodoDone')
  updateTodoDone(@Body('todo_id') todo_id: number) {
    return this.todoService.updateDone(todo_id);
  }

  // 일정 삭제
  @Post('deleteTodo')
  deleteTodo(@Body('todo_id') todo_id: number) {
    return this.todoService.destroy(todo_id);
  }
}
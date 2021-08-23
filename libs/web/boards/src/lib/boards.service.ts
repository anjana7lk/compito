import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Board, BoardList, BoardRequest, Task, TaskRequest } from '@compito/api-interfaces';
import { API_TOKEN } from '@compito/web/ui/tokens';
@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  api = `${this.baseURL}/boards`;
  tasksApi = `${this.baseURL}/tasks`;
  constructor(private http: HttpClient, @Inject(API_TOKEN) private baseURL: string) {}

  get(id: string) {
    return this.http.get<Board>(`${this.api}/${id}`);
  }
  getTask(id: string) {
    return this.http.get<Task>(`${this.tasksApi}/${id}`);
  }

  getPriorities() {
    return this.http.get<string[]>(`${this.tasksApi}/priorities`);
  }
  addTask(task: TaskRequest) {
    return this.http.post<Task>(`${this.tasksApi}`, task);
  }

  updateAssignees(taskId: string, assignees: string[]) {
    const data: Pick<TaskRequest, 'assignees'> = {
      assignees,
    };
    return this.http.patch<Task>(`${this.tasksApi}/${taskId}`, data);
  }

  updateDescription(taskId: string, description: string) {
    const data: Pick<TaskRequest, 'description'> = {
      description,
    };
    return this.http.patch<Task>(`${this.tasksApi}/${taskId}`, data);
  }
  updatePriority(taskId: string, priority: string) {
    const data: Pick<TaskRequest, 'priority'> = {
      priority,
    };
    return this.http.patch<Task>(`${this.tasksApi}/${taskId}`, data);
  }

  addComment(taskId: string, content: string) {
    return this.http.post<any>(`${this.tasksApi}/${taskId}/comments`, { content });
  }

  moveTask(taskId: string, newListId: string) {
    const data: Partial<TaskRequest> = {
      list: newListId,
    };
    return this.http.patch<Task>(`${this.tasksApi}/${taskId}`, data);
  }

  reOrderList(boardId: string, newOrderedList: BoardList[]) {
    const data: Partial<BoardRequest> = {
      lists: newOrderedList,
    };
    return this.http.patch<Task>(`${this.api}/${boardId}`, data);
  }
}

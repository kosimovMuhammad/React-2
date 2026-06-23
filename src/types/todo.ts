export interface Todo {
  id: number;
  name: string;
  description: string;
  images?: any[];
  isCompleted?: boolean;
}

export interface TodoDTO {
  name: string;
  description: string;
  images?: File[];
}

export interface UpdateTodoDTO {
  id: number;
  name: string;
  description: string;
}

export interface GetTodosParams {
  query?: string;
  PageNumber?: number;
  PageSize?: number;
}

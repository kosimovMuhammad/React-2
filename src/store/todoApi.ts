import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Todo, TodoDTO, UpdateTodoDTO, GetTodosParams } from '../types/todo';

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Todo'],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], GetTodosParams | void>({
      query: (params) => ({
        url: 'api/to-dos',
        params: params || undefined,
      }),
      // Handle array or wrapped response
      transformResponse: (response: any) => {
        return Array.isArray(response) ? response : response?.data || [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Todo' as const, id })),
              { type: 'Todo', id: 'LIST' },
            ]
          : [{ type: 'Todo', id: 'LIST' }],
    }),

    getTodoById: builder.query<Todo, number>({
      query: (id) => `api/to-dos/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Todo', id }],
    }),

    createTodo: builder.mutation<Todo, TodoDTO>({
      query: (todo) => {
        const formData = new FormData();
        formData.append('Name', todo.name);
        formData.append('Description', todo.description);
        
        if (todo.images && todo.images.length > 0) {
          todo.images.forEach((image) => {
            formData.append('Images', image);
          });
        }

        return {
          url: 'api/to-dos',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: [{ type: 'Todo', id: 'LIST' }],
    }),

    updateTodo: builder.mutation<void, UpdateTodoDTO>({
      query: (todo) => ({
        url: 'api/to-dos',
        method: 'PUT',
        body: todo, // application/json as per swagger
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Todo', id },
        { type: 'Todo', id: 'LIST' },
      ],
    }),

    deleteTodo: builder.mutation<void, number>({
      query: (id) => ({
        url: 'api/to-dos',
        method: 'DELETE',
        params: { id },
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Todo', id },
        { type: 'Todo', id: 'LIST' },
      ],
    }),

    toggleComplete: builder.mutation<void, number>({
      query: (id) => ({
        url: 'completed',
        method: 'PUT',
        params: { id },
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Todo', id },
        { type: 'Todo', id: 'LIST' },
      ],
    }),

    uploadTodoImages: builder.mutation<void, { todoId: number; images: File[] }>({
      query: ({ todoId, images }) => {
        const formData = new FormData();
        images.forEach((image) => {
          formData.append('Images', image);
        });

        return {
          url: `api/to-dos/${todoId}/images`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { todoId }) => [
        { type: 'Todo', id: todoId },
        { type: 'Todo', id: 'LIST' },
      ],
    }),

    deleteTodoImage: builder.mutation<void, number>({
      query: (imageId) => ({
        url: `api/to-dos/images/${imageId}`,
        method: 'DELETE',
      }),
      // Notice: we might not know exactly which todo to invalidate, 
      // but invalidating the list helps sync everything just in case.
      invalidatesTags: [{ type: 'Todo', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetTodoByIdQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useToggleCompleteMutation,
  useUploadTodoImagesMutation,
  useDeleteTodoImageMutation,
} = todoApi;

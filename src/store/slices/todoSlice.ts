import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://to-dos-api.softclub.tj/api/to-dos';

export interface ToDo {
  id: number;
  name: string;
  description: string;
  images: any[]; 
}

export interface ToDoState {
  items: ToDo[];
  item: ToDo | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ToDoState = {
  items: [],
  item: null,
  status: 'idle',
  error: null,
};

export const fetchToDos = createAsyncThunk('todos/fetchToDos', async () => {
  const response = await axios.get(API_URL);
  return response.data.data; 
});

export const fetchToDoById = createAsyncThunk('todos/fetchToDoById', async (id: number) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data.data;
});

export const createToDo = createAsyncThunk('todos/createToDo', async (formData: FormData) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
});

export const updateToDo = createAsyncThunk('todos/updateToDo', async (data: { id: number; name: string; description: string }) => {
  const response = await axios.put(API_URL, data);
  return response.data.data;
});
export const deleteToDo = createAsyncThunk('todos/deleteToDo', async (id: number) => {
  await axios.delete(`${API_URL}?id=${id}`);
  return id;
});

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchToDos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchToDos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload || [];
      })
      .addCase(fetchToDos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load todos';
      })
      .addCase(fetchToDoById.fulfilled, (state, action) => {
        state.item = action.payload;
      })
      .addCase(createToDo.fulfilled, (state, action) => {
        if (action.payload) {
            state.items.push(action.payload);
        }
      })
      .addCase(updateToDo.fulfilled, (state, action) => {
        if (action.payload) {
            const index = state.items.findIndex(todo => todo.id === action.payload.id);
            if (index !== -1) {
            state.items[index] = action.payload;
            }
        }
      })
      .addCase(deleteToDo.fulfilled, (state, action) => {
        state.items = state.items.filter(todo => todo.id !== action.payload);
      });
  },
});

export default todoSlice.reducer;

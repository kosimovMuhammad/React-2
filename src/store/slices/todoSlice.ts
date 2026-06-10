import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://to-dos-api.softclub.tj";

export interface ToDo {
  id: number;
  name: string;
  description: string;
  images?: string[];
  isCompleted?: boolean;
}

interface ToDoState {
  todos: ToDo[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ToDoState = {
  todos: [],
  status: "idle",
  error: null,
};

export const fetchToDos = createAsyncThunk("todos/fetchToDos", async () => {
  const response = await axios.get(`${BASE_URL}/api/to-dos`);
  return response.data?.data || response.data;
});

export const addToDo = createAsyncThunk("todos/addToDo", async (todoData: FormData) => {
  const response = await axios.post(`${BASE_URL}/api/to-dos`, todoData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data?.data || response.data;
});

export const updateToDo = createAsyncThunk(
  "todos/updateToDo",
  async (todo: { id: number; name: string; description: string }) => {
    const response = await axios.put(`${BASE_URL}/api/to-dos`, todo);
    return todo;
  }
);

export const deleteToDo = createAsyncThunk("todos/deleteToDo", async (id: number) => {
  await axios.delete(`${BASE_URL}/api/to-dos`, { params: { id } });
  return id;
});

export const completeToDo = createAsyncThunk("todos/completeToDo", async (id: number) => {
  await axios.put(`${BASE_URL}/completed`, null, { params: { id } });
  return id;
});

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchToDos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchToDos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.todos = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchToDos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error";
      })
      .addCase(addToDo.fulfilled, (state, action) => {
        if (action.payload && action.payload.id) {
          state.todos.push(action.payload);
        }
      })
      .addCase(updateToDo.fulfilled, (state, action) => {
        const index = state.todos.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = { ...state.todos[index], ...action.payload };
        }
      })
      .addCase(deleteToDo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((t) => t.id !== action.payload);
      })
      .addCase(completeToDo.fulfilled, (state, action) => {
        const index = state.todos.findIndex((t) => t.id === action.payload);
        if (index !== -1) {
          state.todos[index].isCompleted = true;
        }
      });
  },
});

export default todoSlice.reducer;

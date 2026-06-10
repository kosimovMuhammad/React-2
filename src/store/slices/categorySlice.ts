import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://to-dos-api.softclub.tj";

export interface Category {
  id: number;
  name: string;
}

interface CategoryState {
  categories: Category[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  status: "idle",
  error: null,
};

export const fetchCategories = createAsyncThunk("categories/fetchCategories", async () => {
  const response = await axios.get(`${BASE_URL}/api/categories`);
  return response.data?.data || response.data;
});

export const addCategory = createAsyncThunk("categories/addCategory", async (name: string) => {
  const response = await axios.post(`${BASE_URL}/api/categories`, { name });
  return response.data?.data || response.data;
});

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async (category: { id: number; name: string }) => {
    await axios.put(`${BASE_URL}/api/categories`, category);
    return category;
  }
);

export const deleteCategory = createAsyncThunk("categories/deleteCategory", async (id: number) => {
  await axios.delete(`${BASE_URL}/api/categories`, { params: { id } });
  return id;
});

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch categories";
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        if (action.payload && action.payload.id) {
          state.categories.push(action.payload);
        }
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c.id !== action.payload);
      });
  },
});

export default categorySlice.reducer;

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { BasicData } from '../types/basic'

const initialState: BasicData[] = [
  { id: 'user-1', name: 'Alexey', surname: 'Ivanov', status: true },
  { id: 'user-2', name: 'Maria', surname: 'Petrova', status: false },
]

const basicSlice = createSlice({
  name: 'basic',
  initialState,
  reducers: {
    addBasic(state, action: PayloadAction<BasicData>) {
      state.push(action.payload)
    },
    updateBasic(state, action: PayloadAction<BasicData>) {
      const index = state.findIndex(u => u.id === action.payload.id)
      if (index !== -1) state[index] = action.payload
    },
    removeBasic(state, action: PayloadAction<string>) {
      return state.filter(u => u.id !== action.payload)
    },
    toggleStatus(state, action: PayloadAction<string>) {
      const user = state.find(u => u.id === action.payload)
      if (user) {
        user.status = !user.status
      }
    },
  },
})

export const { addBasic, updateBasic, removeBasic, toggleStatus } = basicSlice.actions
export default basicSlice.reducer

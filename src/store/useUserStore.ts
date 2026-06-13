import { create } from "zustand";
import type { User, CreateUserDTO, UpdateUserDTO } from "../types/user";

interface UserState {
  users: User[];
  selectedId: string | null;

  getById: (id: string) => User | undefined;
  getAll: () => User[];

  create: (data: CreateUserDTO) => User;
  update: (id: string, data: UpdateUserDTO) => void;
  remove: (id: string) => void;

  select: (id: string | null) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [
    {
      id: "1",
      name: "Ali Valiyev",
      email: "ali@example.com",
      role: "admin",
      createdAt: new Date("2026-01-10").toISOString(),
    },
    {
      id: "2",
      name: "Barno Rahimova",
      email: "barno@example.com",
      role: "user",
      createdAt: new Date("2026-02-15").toISOString(),
    },
    {
      id: "3",
      name: "Jasur Toshmatov",
      email: "jasur@example.com",
      role: "moderator",
      createdAt: new Date("2026-03-20").toISOString(),
    },
  ],
  selectedId: null,

  getAll: () => get().users,

  getById: (id: string) => get().users.find((u) => u.id === id),

  create: (data: CreateUserDTO) => {
    const newUser: User = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ users: [...state.users, newUser] }));
    return newUser;
  },

  update: (id: string, data: UpdateUserDTO) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
    }));
  },

  remove: (id: string) => {
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }));
  },

  select: (id: string | null) => set({ selectedId: id }),
}));

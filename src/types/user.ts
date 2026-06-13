export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  createdAt: string;
}

export type CreateUserDTO = Omit<User, "id" | "createdAt">;
export type UpdateUserDTO = Partial<CreateUserDTO>;

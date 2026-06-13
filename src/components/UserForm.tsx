import { useState } from "react";
import { useUserStore } from "../store/useUserStore";
import type { CreateUserDTO } from "../types/user";

const EMPTY: CreateUserDTO = { name: "", email: "", role: "user" };

export default function UserForm() {
  const { create } = useUserStore();
  const [form, setForm] = useState<CreateUserDTO>(EMPTY);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError("Ism va email majburiy!");
      return;
    }
    create(form);
    setForm(EMPTY);
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h2 className="form-title">Yangi foydalanuvchi</h2>
      {error && <p className="form-error">{error}</p>}
      <div className="field-group">
        <label>Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Full name"
        />
      </div>
      <div className="field-group">
        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="user@example.com"
        />
      </div>
      <div className="field-group">
        <label>Role</label>
        <select
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value as CreateUserDTO["role"] })
          }
        >
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary">
        + Add
      </button>
    </form>
  );
}

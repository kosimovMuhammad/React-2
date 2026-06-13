import { useState } from "react";
import { useUserStore } from "../store/useUserStore";
import type { UpdateUserDTO } from "../types/user";

const ROLE_BADGE: Record<string, string> = {
  admin: "badge-admin",
  moderator: "badge-mod",
  user: "badge-user",
};

export default function UserList() {
  const { users, selectedId, select, remove, update } = useUserStore();
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<UpdateUserDTO>({});

  const startEdit = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    setEditId(id);
    setEditData({ name: user.name, email: user.email, role: user.role });
  };

  const saveEdit = () => {
    if (editId) {
      update(editId, editData);
      setEditId(null);
      setEditData({});
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  if (users.length === 0)
    return <div className="empty-state">Hech qanday foydalanuvchi yo'q.</div>;

  return (
    <div className="user-list">
      {users.map((user) => {
        const isSelected = selectedId === user.id;
        const isEditing = editId === user.id;

        return (
          <div
            key={user.id}
            className={`user-card ${isSelected ? "selected" : ""}`}
            onClick={() => !isEditing && select(isSelected ? null : user.id)}
          >
            {isEditing ? (
              <div className="edit-form" onClick={(e) => e.stopPropagation()}>
                <input
                  value={editData.name ?? ""}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  placeholder="Ism"
                />
                <input
                  value={editData.email ?? ""}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  placeholder="Email"
                />
                <select
                  value={editData.role ?? "user"}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      role: e.target.value as UpdateUserDTO["role"],
                    })
                  }
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="edit-actions">
                  <button className="btn btn-success" onClick={saveEdit}>
                    Saqlash
                  </button>
                  <button className="btn btn-ghost" onClick={cancelEdit}>
                    Bekor
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="user-info">
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <strong>{user.name}</strong>
                    <span className="user-email">{user.email}</span>
                    <span className="user-meta">
                      ID: <code>{user.id.slice(0, 8)}…</code>
                    </span>
                  </div>
                  <span className={`badge ${ROLE_BADGE[user.role]}`}>
                    {user.role}
                  </span>
                </div>
                <div
                  className="user-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="btn btn-edit"
                    onClick={() => startEdit(user.id)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => remove(user.id)}
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

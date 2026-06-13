import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { removeBasic, toggleStatus, updateBasic } from '../store/basicSlice'
import type { BasicData } from '../types/basic'

export default function BasicList() {
  const dispatch = useAppDispatch()
  const users = useAppSelector(s => s.basic)

  const [editId, setEditId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Omit<BasicData, 'id' | 'status'>>({ name: '', surname: '' })

  const startEdit = (user: BasicData) => {
    setEditId(user.id)
    setEditData({ name: user.name, surname: user.surname })
  }

  const saveEdit = (user: BasicData) => {
    dispatch(updateBasic({ ...user, ...editData }))
    setEditId(null)
  }

  const cancelEdit = () => setEditId(null)

  if (users.length === 0)
    return <div className="empty-state">No users found.</div>

  return (
    <div className="user-list">
      {users.map(user => {
        const isEditing = editId === user.id

        return (
          <div key={user.id} className="user-card">
            {isEditing ? (
              <div className="edit-form">
                <input
                  value={editData.name}
                  onChange={e => setEditData({ ...editData, name: e.target.value })}
                  placeholder="Name"
                />
                <input
                  value={editData.surname}
                  onChange={e => setEditData({ ...editData, surname: e.target.value })}
                  placeholder="Surname"
                />
                <div className="edit-actions">
                  <button className="btn btn-success" onClick={() => saveEdit(user)}>
                    Save
                  </button>
                  <button className="btn btn-ghost" onClick={cancelEdit}>
                    Cancel
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
                    <strong>{user.name} {user.surname}</strong>
                    <span className="user-meta">
                      ID: <code>{user.id}</code>
                    </span>
                  </div>
                  <button
                    className={`status-badge ${user.status ? 'status-active' : 'status-inactive'}`}
                    onClick={() => dispatch(toggleStatus(user.id))}
                    title="Click to toggle"
                  >
                    {user.status ? '● Active' : '○ Inactive'}
                  </button>
                </div>
                <div className="user-actions">
                  <button className="btn btn-edit" onClick={() => startEdit(user)}>✏️</button>
                  <button className="btn btn-danger" onClick={() => dispatch(removeBasic(user.id))}>🗑️</button>
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

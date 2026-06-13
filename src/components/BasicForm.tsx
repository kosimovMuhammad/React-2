import { useState } from 'react'
import { useAppDispatch } from '../store/hooks'
import { addBasic } from '../store/basicSlice'
import type { BasicData } from '../types/basic'

const empty = { name: '', surname: '', status: true }

export default function BasicForm() {
  const dispatch = useAppDispatch()
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.surname.trim()) {
      setError('Name and surname are required!')
      return
    }
    const newUser: BasicData = {
      id: `user-${crypto.randomUUID()}`,
      ...form,
    }
    dispatch(addBasic(newUser))
    setForm(empty)
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h2 className="form-title">Add User</h2>
      {error && <p className="form-error">{error}</p>}

      <div className="field-group">
        <label>Name</label>
        <input
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="First name"
        />
      </div>

      <div className="field-group">
        <label>Surname</label>
        <input
          value={form.surname}
          onChange={e => setForm({ ...form, surname: e.target.value })}
          placeholder="Last name"
        />
      </div>

      <div className="field-group">
        <label>Status</label>
        <div className="toggle-row">
          <span className={form.status ? 'status-on' : 'status-off'}>
            {form.status ? 'Active' : 'Inactive'}
          </span>
          <button
            type="button"
            className={`toggle-btn ${form.status ? 'on' : 'off'}`}
            onClick={() => setForm({ ...form, status: !form.status })}
          >
            <span className="toggle-thumb" />
          </button>
        </div>
      </div>

      <button type="submit" className="btn btn-primary">
        + Add User
      </button>
    </form>
  )
}

import { create } from 'zustand'
import type { ContactData } from '../types'

interface ContactStore {
  contacts: ContactData[]
  addContact: (data: ContactData) => void
  updateContact: (data: ContactData) => void
  removeContact: (id: string) => void
}

export const useContactStore = create<ContactStore>((set) => ({
  contacts: [
    { id: 'user-1', phone: '+992 90 111 2233', job: 'Frontend Developer' },
    { id: 'user-2', phone: '+992 91 222 3344', job: 'Designer' },
  ],
  addContact: (data) => set((s) => ({ contacts: [...s.contacts, data] })),
  updateContact: (data) => set((s) => ({
    contacts: s.contacts.map(c => c.id === data.id ? data : c)
  })),
  removeContact: (id) => set((s) => ({
    contacts: s.contacts.filter(c => c.id !== id)
  })),
}))

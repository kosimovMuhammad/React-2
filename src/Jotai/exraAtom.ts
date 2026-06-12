import { atom } from 'jotai'
import type { ExtraData } from '../types'

export const extrasAtom = atom<ExtraData[]>([
  { id: 'user-1', age: 28, address: 'Душанбе' },
  { id: 'user-2', age: 24, address: 'Хуҷанд' },
])

export const addExtraAtom = atom(null, (_get, set, data: ExtraData) => {
  set(extrasAtom, (prev) => [...prev, data])
})

export const updateExtraAtom = atom(null, (_get, set, data: ExtraData) => {
  set(extrasAtom, (prev) => prev.map(e => e.id === data.id ? data : e))
})

export const removeExtraAtom = atom(null, (_get, set, id: string) => {
  set(extrasAtom, (prev) => prev.filter(e => e.id !== id))
})

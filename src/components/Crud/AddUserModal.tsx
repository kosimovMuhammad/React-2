import { useState } from 'react'
import { useAppDispatch } from '../../Redux/store'
import { addBasic } from '../../Redux/basicSlice'
import { useContactStore } from '../../Zustant/contactStore'
import { useSetAtom } from 'jotai'
import { addExtraAtom } from '../../Jotai/exraAtom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const dispatch = useAppDispatch()
  const addContact = useContactStore(s => s.addContact)
  const addExtra = useSetAtom(addExtraAtom)

  const [form, setForm] = useState({
    name: '', surname: '', phone: '', job: '', age: '', address: '', status: true
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = `user-${Date.now()}`

    dispatch(addBasic({ id, name: form.name, surname: form.surname, status: form.status }))
    addContact({ id, phone: form.phone, job: form.job })
    addExtra({ id, age: Number(form.age) || 0, address: form.address })

    setForm({ name: '', surname: '', phone: '', job: '', age: '', address: '', status: true })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm lg:max-w-md m-auto p-0 bg-[#14142b] border-white/8 shadow-2xl shadow-black/50 backdrop-blur-xl overflow-hidden">
        <div className="relative px-6 pt-6 pb-4">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-violet-500 via-indigo-500 to-violet-500" />
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white/90">Add User</DialogTitle>
            <p className="text-sm text-white/40 mt-1">Create a new user profile</p>
          </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
               <label className="text-xs font-semibold text-violet-400/80 tracking-wider uppercase">Name</label>
               <input required className="w-full input-dark rounded-lg p-2.5 text-sm" 
                      value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John" />
            </div>
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
               <label className="text-xs font-semibold text-violet-400/80 tracking-wider uppercase">Surname</label>
               <input required className="w-full input-dark rounded-lg p-2.5 text-sm" 
                      value={form.surname} onChange={e => setForm({...form, surname: e.target.value})} placeholder="Doe" />
            </div>

            <div className="col-span-2 sm:col-span-1 space-y-1.5">
               <label className="text-xs font-semibold text-indigo-400/80 tracking-wider uppercase">Phone</label>
               <input required className="w-full input-dark rounded-lg p-2.5 text-sm" 
                      value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+1 234 567 890" />
            </div>
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
               <label className="text-xs font-semibold text-indigo-400/80 tracking-wider uppercase">Job</label>
               <input required className="w-full input-dark rounded-lg p-2.5 text-sm" 
                      value={form.job} onChange={e => setForm({...form, job: e.target.value})} placeholder="Developer" />
            </div>

            <div className="col-span-2 sm:col-span-1 space-y-1.5">
               <label className="text-xs font-semibold text-emerald-400/80 tracking-wider uppercase">Age</label>
               <input required type="number" min="0" className="w-full input-dark rounded-lg p-2.5 text-sm" 
                      value={form.age} onChange={e => setForm({...form, age: e.target.value})} placeholder="25" />
            </div>
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
               <label className="text-xs font-semibold text-emerald-400/80 tracking-wider uppercase">Address</label>
               <input required className="w-full input-dark rounded-lg p-2.5 text-sm" 
                      value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="City, Street" />
            </div>
            
           <div className="col-span-2 flex flex-col gap-1.5 mt-1">
              <label className="text-xs font-semibold text-violet-400/80 tracking-wider uppercase">Status</label>
              <select
                value={form.status ? "true" : "false"}
                onChange={(e) => setForm({ ...form, status: e.target.value === "true" })}
                className="w-full h-10 px-3 rounded-lg input-dark text-sm cursor-pointer"
              >
                <option value="true" className="bg-[#14142b] text-white">Active</option>
                <option value="false" className="bg-[#14142b] text-white">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end pt-4 mt-2 border-t border-white/5">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-white/50 bg-white/5 rounded-xl hover:bg-white/10 hover:text-white/70 transition-all border border-white/5">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20 transition-all active:scale-[0.97]">Save</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

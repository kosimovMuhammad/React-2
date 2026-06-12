import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/Redux/store'
import { removeBasic, toggleStatus } from '@/Redux/basicSlice'
import { useContactStore } from '@/Zustant/contactStore'
import { useAtomValue, useSetAtom } from 'jotai'
import { extrasAtom, removeExtraAtom } from '@/Jotai/exraAtom'

import AddUserModal from '@/components/Crud/AddUserModal'
import EditUserModal from '@/components/Crud/EditUserModal'
import InfoUserModal from "@/components/Crud/InfoModal"
import DeleteModal from "@/components/Crud/DeleteModal"
import { MoreHorizontalIcon, InfoIcon, Edit2Icon, Trash2Icon, SearchIcon, PlusIcon, UsersIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function App() {
  const dispatch = useAppDispatch()

  const basics = useAppSelector(s => s.basic)

  const contacts = useContactStore(s => s.contacts)
  const removeContact = useContactStore(s => s.removeContact)

  const extras = useAtomValue(extrasAtom)
  const removeExtra = useSetAtom(removeExtraAtom)

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [infoUser, setInfoUser] = useState<any>(null)
  const [deletingUser, setDeletingUser] = useState<any>(null)
  const [search, setSearch] = useState('')

  const allIds = Array.from(new Set([
    ...basics.map(b => b.id),
    ...contacts.map(c => c.id),
    ...extras.map(e => e.id)
  ]))

  const mergedUsers = allIds.map(id => {
    const basic = basics.find(b => b.id === id) || { name: '—', surname: '—', status: false }
    const contact = contacts.find(c => c.id === id) || { phone: '—', job: '—' }
    const extra = extras.find(e => e.id === id) || { age: 0, address: '—' }

    return {
      id,
      name: basic.name,
      surname: basic.surname,
      status: basic.status,
      phone: contact.phone,
      job: contact.job,
      age: extra.age,
      address: extra.address
    }
  })

  const filteredUsers = mergedUsers.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.surname.toLowerCase().includes(search.toLowerCase()) ||
    user.job.toLowerCase().includes(search.toLowerCase()) ||
    user.age.toString().includes(search) 
  )

  const handleDelete = (id: string) => {
    dispatch(removeBasic(id))
    removeContact(id)
    removeExtra(id)
  }

  const handleToggleStatus = (id: string) => {
    dispatch(toggleStatus(id))
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="ambient-glow" />

      <div className="relative z-10 p-6 sm:p-10">
        <div className="max-w-7xl mx-auto space-y-8">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 animate-fade-in-up">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
                    Users Management
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-72 group">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/25 group-focus-within:text-violet-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full input-dark rounded-xl py-2.5 pl-10 pr-4 text-sm"
                />
              </div>

              <button
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.97] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-violet-500/25 whitespace-nowrap"
              >
                <PlusIcon className="size-4" />
                Add User
              </button>
            </div>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden animate-card-in shadow-2xl shadow-black/20">
            <div className="overflow-x-auto">
              <Table className="w-full text-sm text-left">
                <TableHeader className="border-b border-white/5">
                  <TableRow className="hover:bg-transparent border-b border-white/5">
                    <TableHead className="px-5 py-4 text-violet-400/80 text-center w-[80px] text-[11px] font-semibold tracking-wider uppercase">Select</TableHead>
                    <TableHead className="px-5 py-4 text-violet-400/80 text-[11px] font-semibold tracking-wider uppercase">Name</TableHead>
                    <TableHead className="px-5 py-4 text-violet-400/80 text-[11px] font-semibold tracking-wider uppercase">Surname</TableHead>
                    <TableHead className="px-5 py-4 text-violet-400/80 text-[11px] font-semibold tracking-wider uppercase">Status</TableHead>
                    <TableHead className="px-5 py-4 text-indigo-400/80 text-[11px] font-semibold tracking-wider uppercase">Phone</TableHead>
                    <TableHead className="px-5 py-4 text-indigo-400/80 text-[11px] font-semibold tracking-wider uppercase">Job</TableHead>
                    <TableHead className="px-5 py-4 text-emerald-400/80 text-[11px] font-semibold tracking-wider uppercase">Age</TableHead>
                    <TableHead className="px-5 py-4 text-emerald-400/80 text-[11px] font-semibold tracking-wider uppercase">Address</TableHead>
                    <TableHead className="px-5 py-4 text-right text-white/30 text-[11px] font-semibold tracking-wider uppercase">Action</TableHead>
                  </TableRow>
                </TableHeader>
               <TableBody className="divide-y divide-white/4">
  {filteredUsers.map((user, index) => (
    <TableRow
      key={user.id}
      className={`table-row-hover border-b border-white/4 ${
        !user.status ? "opacity-60" : ""
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <TableCell className="px-5 py-4 text-center">
        <div className="flex items-center justify-center">
          <Checkbox
            id={`user-${user.id}`}
            checked={user.status}
            onCheckedChange={() => handleToggleStatus(user.id)}
            className="border-white/20 bg-white/5 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-500 data-[state=checked]:text-white focus-visible:ring-violet-500 focus-visible:ring-offset-0 cursor-pointer transition-all"
          />
        </div>
      </TableCell>
      <TableCell className="px-5 py-4 font-medium text-white/90">{user.name}</TableCell>
      <TableCell className="px-5 py-4 text-white/60">{user.surname}</TableCell>
      <TableCell className="px-5 py-4">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-all ${
            user.status 
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" 
              : "bg-white/5 text-white/40 border border-white/10"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${user.status ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
          {user.status ? "Active" : "Inactive"}
        </span>
      </TableCell>
      <TableCell className="px-5 py-4 text-white/50 font-mono text-xs">{user.phone}</TableCell>
      <TableCell className="px-5 py-4 text-white/60">{user.job}</TableCell>
      <TableCell className="px-5 py-4 text-white/60">{user.age}</TableCell>
      <TableCell className="px-5 py-4 text-white/40 max-w-[150px] truncate">
        {user.address}
      </TableCell>
      <TableCell className="px-5 py-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-8 text-white/40 hover:text-white/80 hover:bg-white/5"
            >
              <MoreHorizontalIcon className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1a1a2e] border-white/10 text-white/80 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <DropdownMenuItem 
              onClick={() => setInfoUser(user)}
              className="focus:bg-emerald-500/10 focus:text-emerald-400 cursor-pointer gap-2"
            >
              <InfoIcon className="size-3.5" />
              Info
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setEditingUser(user)}
              className="focus:bg-indigo-500/10 focus:text-indigo-400 cursor-pointer gap-2"
            >
              <Edit2Icon className="size-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem
              onClick={() => setDeletingUser(user)}
              className="focus:bg-red-500/10 focus:text-red-400 text-red-400 cursor-pointer gap-2"
            >
              <Trash2Icon className="size-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  ))}

  {filteredUsers.length === 0 && (
    <TableRow>
      <TableCell colSpan={9} className="px-5 py-16 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-full bg-white/5">
            <UsersIcon className="size-6 text-white/20" />
          </div>
          <p className="text-white/30 text-sm">No users found</p>
        </div>
      </TableCell>
    </TableRow>
  )}
</TableBody>
              </Table>
            </div>
          </div>

        </div>
      </div>

      <AddUserModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditUserModal isOpen={!!editingUser} onClose={() => setEditingUser(null)} user={editingUser} />
      <InfoUserModal isOpen={!!infoUser} onClose={() => setInfoUser(null)} user={infoUser} />
      <DeleteModal 
        isOpen={!!deletingUser} 
        onClose={() => setDeletingUser(null)} 
        onConfirm={() => deletingUser && handleDelete(deletingUser.id)} 
        userName={deletingUser ? `${deletingUser.name} ${deletingUser.surname}` : ''}
      />

    </div>
  )
}
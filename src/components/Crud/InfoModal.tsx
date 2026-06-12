import { UserIcon, PhoneIcon, MapPinIcon, BriefcaseIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface InfoUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    name: string
    surname: string
    phone: string
    job: string
    age: number
    address: string
    status: boolean
  } | null
}

export default function InfoUserModal({ isOpen, onClose, user }: InfoUserModalProps) {
  if (!isOpen || !user) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 bg-[#14142b] border-white/8 shadow-2xl shadow-black/50 backdrop-blur-xl overflow-hidden">
        {/* Header with user avatar and name */}
        <div className="relative px-6 pt-8 pb-5">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-500" />
          
          <DialogHeader className="flex items-center gap-4 flex-row">
            <div className="p-3 rounded-xl bg-linear-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20">
              <UserIcon className="size-5 text-violet-400" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl font-semibold text-white/90 tracking-tight leading-none">
                {user.name} {user.surname}
              </DialogTitle>
              <p className="text-sm text-white/40 flex items-center gap-1.5">
                <BriefcaseIcon className="size-3" />
                {user.job || 'No specified job'}
              </p>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3.5 bg-white/30 border border-white/6">
              <span className="block text-[10px] font-semibold tracking-wider text-white/30 uppercase mb-2">Status</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                user.status 
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-white/5 text-white/40 border border-white/10'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${user.status ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
                {user.status ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="rounded-xl p-3.5 bg-white/30 border border-white/6">
              <span className="block text-[10px] font-semibold tracking-wider text-white/30 uppercase mb-2">Age</span>
              <p className="text-sm font-medium text-white/80">
                {user.age} <span className="text-white/30 font-normal text-xs">years old</span>
              </p>
            </div>
          </div>

          <div className="rounded-xl p-3.5 bg-white/30 border border-white/6">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase mb-2">
              <PhoneIcon className="size-3" />
              Phone Number
            </span>
            <p className="text-sm font-mono text-white/70 tracking-wide">{user.phone || '—'}</p>
          </div>

          <div className="rounded-xl p-3.5 bg-white/30 border border-white/6">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-white/30 uppercase mb-2">
              <MapPinIcon className="size-3" />
              Address
            </span>
            <p className="text-sm text-white/70 leading-relaxed">{user.address || '—'}</p>
          </div>

        </div>

        <div className="px-6 pb-6 pt-1 flex justify-end">
          <button 
            onClick={onClose} 
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white/50 bg-white/5 hover:bg-white/10 hover:text-white/70 rounded-xl border border-white/5 transition-all duration-200"
          >
            Close Profile
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
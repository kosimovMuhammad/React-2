import React from 'react';
import { AlertTriangleIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, userName }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm p-0 bg-[#14142b] border-white/8 shadow-2xl shadow-black/50 backdrop-blur-xl overflow-hidden">
        <div className="relative px-6 pt-6 pb-4">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500 via-rose-500 to-red-500" />
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangleIcon className="size-5 text-red-400" />
              </div>
              <DialogTitle className="text-xl font-bold text-white/90">Delete User</DialogTitle>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 pb-2">
          <p className="text-sm text-white/50 leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-white/80">{userName}</span>? This action cannot be undone.
          </p>
        </div>
        
        <div className="flex gap-3 justify-end px-6 pb-6 pt-4 mt-2">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-5 py-2.5 text-sm font-medium text-white/50 bg-white/5 rounded-xl hover:bg-white/10 hover:text-white/70 transition-all border border-white/5"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-rose-600 rounded-xl hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-500/20 transition-all active:scale-[0.97]"
          >
            Delete
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

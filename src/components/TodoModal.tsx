import React, { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useAppDispatch } from "../store/hooks";
import { addToDo, updateToDo, type ToDo } from "../store/slices/todoSlice";
import { Type, AlignLeft, UploadCloud, X } from "lucide-react";

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  todoToEdit: ToDo | null;
}

export const TodoModal: React.FC<TodoModalProps> = ({ isOpen, onClose, todoToEdit }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoToEdit) {
      setName(todoToEdit.name);
      setDescription(todoToEdit.description || "");
      setImages([]);
      setPreviewUrls([]);
    } else {
      setName("");
      setDescription("");
      setImages([]);
      setPreviewUrls([]);
    }
  }, [todoToEdit, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);
      const urls = filesArray.map((f) => URL.createObjectURL(f));
      setPreviewUrls((prev) => [...prev, ...urls]);
    }
  };

  const removePreview = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (todoToEdit) {
      dispatch(updateToDo({ id: todoToEdit.id, name, description }));
    } else {
      const formData = new FormData();
      formData.append("Name", name);
      formData.append("Description", description);
      images.forEach((img) => formData.append("Images", img));
      dispatch(addToDo(formData));
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-8 border-white/5 bg-[#1a1625] shadow-2xl rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
            {todoToEdit ? "Edit Item" : "New Item"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="relative">
            <div className="absolute top-[14px] left-4 text-indigo-400/50">
              <Type className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#231e32] border border-transparent focus:border-indigo-500/30 rounded-2xl py-3.5 pl-12 pr-4 text-zinc-200 placeholder:text-zinc-600 outline-none transition-all"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute top-[14px] left-4 text-indigo-400/50">
              <AlignLeft className="w-5 h-5" />
            </div>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-[#231e32] border border-transparent focus:border-indigo-500/30 rounded-2xl py-3.5 pl-12 pr-4 text-zinc-200 placeholder:text-zinc-600 outline-none transition-all resize-none"
            />
          </div>

          {!todoToEdit && (
            <div className="space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-[#231e32] border border-transparent hover:border-indigo-500/30 rounded-2xl p-4 flex items-center justify-center gap-2 text-zinc-500 cursor-pointer transition-all"
              >
                <UploadCloud className="w-5 h-5" />
                <span>Add Images</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </div>

              {previewUrls.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {previewUrls.map((url, idx) => (
                    <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 group">
                      <img src={url} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePreview(idx)}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-4 mt-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(99,102,241,0.3)] flex justify-center items-center gap-2"
          >
            {todoToEdit ? (
              <span>Save Changes</span>
            ) : (
              <>
                <span className="text-2xl leading-none mb-1">+</span> Create Item
              </>
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

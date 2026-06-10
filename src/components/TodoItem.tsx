import React from "react";
import { type ToDo, deleteToDo, completeToDo } from "../store/slices/todoSlice";
import { useAppDispatch } from "../store/hooks";
import { Edit2, Trash2, CheckSquare } from "lucide-react";
import { cn } from "../lib/utils";

interface TodoItemProps {
  todo: ToDo;
  onEdit: (todo: ToDo) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit }) => {
  const dispatch = useAppDispatch();
  const IMAGE_BASE = "https://to-dos-api.softclub.tj/images/";

  return (
    <div
      className={cn(
        "flex flex-col p-6 rounded-3xl bg-[#1a1625] border border-white/5 transition-all hover:border-white/10 hover:-translate-y-1 shadow-lg relative overflow-hidden",
        todo.isCompleted && "opacity-50"
      )}
    >
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className={cn("font-bold text-xl text-white mb-2", todo.isCompleted && "line-through text-zinc-500")}>
            {todo.name}
          </h3>
          {!todo.isCompleted && (
            <button
              onClick={() => dispatch(completeToDo(todo.id))}
              className="text-zinc-500 hover:text-emerald-400 transition-colors p-1"
              title="Complete"
            >
              <CheckSquare className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {todo.description && (
          <p className="text-zinc-500 text-sm mb-4 line-clamp-3 leading-relaxed">
            {todo.description}
          </p>
        )}

        {todo.images && todo.images.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {todo.images.map((img, idx) => (
              <div key={idx} className="w-12 h-12 rounded-lg overflow-hidden border border-white/10">
                <img
                  src={`${IMAGE_BASE}${img}`}
                  alt="Attachment"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-5 border-t border-white/5 flex gap-3">
        <button
          onClick={() => onEdit(todo)}
          className="flex-1 flex items-center justify-center gap-2 bg-[#231e32] hover:bg-[#2a243b] text-zinc-300 py-2.5 rounded-xl transition-colors text-sm font-medium"
        >
          <Edit2 className="w-4 h-4" /> Edit
        </button>
        <button
          onClick={() => dispatch(deleteToDo(todo.id))}
          className="flex-1 flex items-center justify-center gap-2 bg-[#231e32] hover:bg-[#2a243b] text-zinc-300 hover:text-red-400 py-2.5 rounded-xl transition-colors text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  );
};

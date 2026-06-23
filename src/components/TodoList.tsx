import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Plus, Edit2, Trash2, Search, Loader2, X, Zap } from 'lucide-react';
import type { RootState, AppDispatch } from '../store';
import {
  fetchToDos,
  fetchToDoById,
  createToDo,
  updateToDo,
  deleteToDo,
  type ToDo
} from '../store/slices/todoSlice';

interface TodoFormData {
  name: string;
  description: string;
  images?: FileList;
}

const TiltCard: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className, style }) => {
  const [transform, setTransform] = React.useState('');
  const [isHovered, setIsHovered] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Reduced from 30 to 15 to make it smoother and prevent extreme distortion
    const rotateX = -((y - centerY) / centerY) * 20; 
    const rotateY = ((x - centerX) / centerX) * 20;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.1, 1.2, 1.2)`);
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('');
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, perspective: '1000px' }}
      className="relative w-full h-full"
    >
      <div
        className={className}
        style={{
          transform: transform || 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered 
            ? 'transform 0.1s cubic-bezier(0.15, 0.8, 0.25, 1)' 
            : 'transform 0.1s cubic-bezier(0.15, 0.8, 0.25, 1), border-color 0.3s ease, box-shadow 0.3s ease',
          height: '100%',
          width: '100%',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const TodoList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, item, status, error } = useSelector((state: RootState) => state.todos);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [searchId, setSearchId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TodoFormData>({
    defaultValues: {
      name: '',
      description: '',
    }
  });

  useEffect(() => {
    dispatch(fetchToDos());
  }, [dispatch]);

  const openModal = (todo?: ToDo) => {
    if (todo) {
      setEditId(todo.id);
      setValue('name', todo.name);
      setValue('description', todo.description);
    } else {
      setEditId(null);
      reset({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    reset({ name: '', description: '' });
  };

  const onSubmit = async (data: TodoFormData) => {
    setIsSubmitting(true);
    try {
      if (editId) {
        await dispatch(updateToDo({ id: editId, name: data.name, description: data.description })).unwrap();
      } else {
        const formData = new FormData();
        formData.append('Name', data.name);
        formData.append('Description', data.description || '');
        
        if (data.images && data.images.length > 0) {
          for (let i = 0; i < data.images.length; i++) {
            formData.append('Images', data.images[i]);
          }
        }
        await dispatch(createToDo(formData)).unwrap();
      }
      dispatch(fetchToDos());
      closeModal();
    } catch (err) {
      console.error('Failed to save todo', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    dispatch(deleteToDo(id));
  };

  const handleSearchById = () => {
    if (searchId) {
      dispatch(fetchToDoById(Number(searchId)));
    }
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-[#070709] text-zinc-100 font-sans selection:bg-[#8B7CFF]/30">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 bg-[#1A1528] border border-[#3A2D5C] rounded-2xl shadow-[0_0_20px_rgba(139,124,255,0.15)]">
              <Zap className="text-[#8B7CFF]" size={28} />
            </div>
            <h1 className="text-4xl font-black tracking-tight flex items-center">
              <span className="text-white">Nexus</span>
              <span className="text-[#8B7CFF]">Tasks</span>
            </h1>
          </div>
          
          <button
            onClick={() => openModal()}
            className="group flex items-center gap-2 bg-white hover:bg-gray-200 text-black px-6 py-3.5 rounded-[1rem] font-bold transition-all duration-300 active:scale-95"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            New Task
          </button>
        </div>
        
        {/* Search Section */}
        <div className="mb-10">
          <div className="flex items-center bg-[#111114] border border-white/5 rounded-[1.25rem] p-2 focus-within:border-[#3A2D5C] focus-within:shadow-[0_0_20px_rgba(139,124,255,0.05)] transition-all duration-300">
            <div className="pl-4 pr-2 flex items-center justify-center">
              <Search className="text-zinc-500" size={22} />
            </div>
            <input
              type="number"
              placeholder="Search task by ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1 bg-transparent border-none text-zinc-100 placeholder-zinc-600 px-2 py-4 focus:outline-none text-lg"
            />
            <button
              onClick={handleSearchById}
              className="bg-[#212126] hover:bg-[#2A2A30] text-white px-8 py-3.5 rounded-xl transition-all duration-300 active:scale-95 font-bold"
            >
              Search
            </button>
          </div>
          
          {item && (
            <div className="mt-6 p-6 bg-[#111114] border border-[#3A2D5C] rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-[#8B7CFF] uppercase tracking-wider text-sm">
                  Search Result
                </h3>
                <span className="bg-[#1A1A20] text-zinc-500 text-xs px-2.5 py-1 rounded-md font-mono">#{item.id}</span>
              </div>
              <p className="text-2xl font-bold text-white mt-1">{item.name}</p>
              <p className="text-zinc-400 mt-2">{item.description}</p>
            </div>
          )}
        </div>

        {/* Todo List */}
        <div className="space-y-6">
          {status === 'loading' && (
            <div className="flex justify-center items-center py-20 text-[#8B7CFF]">
              <Loader2 className="animate-spin" size={48} />
            </div>
          )}
          
          {status === 'failed' && (
            <div className="p-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl text-center font-bold">
              {error}
            </div>
          )}
          
          {status === 'succeeded' && items.length === 0 && (
            <div className="text-center py-20 text-zinc-600 animate-in fade-in zoom-in duration-500">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#111114] mb-6 border border-white/5">
                <Search size={32} className="opacity-30" />
              </div>
              <p className="text-2xl font-bold text-zinc-400">No tasks found.</p>
              <p className="text-md mt-2">Create a new task to get started.</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((todo, idx) => (
              <TiltCard 
                key={todo.id} 
                className="group relative p-6 sm:p-8 bg-[#0C0C0F] border border-white/5 rounded-[1.5rem] flex flex-col hover:bg-[#111114] hover:border-[#3A2D5C] transition-colors duration-300 animate-in fade-in slide-in-from-bottom-8 h-full"
                style={{ animationFillMode: 'both', animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex-1 flex flex-col">
                  {/* Card Header (Title + ID) */}
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="font-bold text-2xl text-white leading-tight">
                      {todo.name}
                    </h3>
                    <span className="shrink-0 bg-[#1A1A20] text-zinc-500 text-xs px-2.5 py-1.5 rounded-lg font-mono">
                      #{todo.id}
                    </span>
                  </div>
                  
                  {/* Description */}
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
                    {todo.description}
                  </p>
                  
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-auto pt-2">
                  <button
                    onClick={() => openModal(todo)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#141418] hover:bg-[#1A1A20] text-zinc-400 hover:text-white rounded-xl transition-all duration-300 font-medium text-sm"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#141418] hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded-xl transition-all duration-300 font-medium text-sm"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={closeModal}
            />
            
            <div className="relative w-full max-w-lg bg-[#0C0C0F] border border-[#3A2D5C] rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center p-8 border-b border-white/5">
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {editId ? 'Edit Task' : 'New Task'}
                </h2>
                <button 
                  onClick={closeModal}
                  className="text-zinc-500 hover:text-white transition-all duration-300 p-2 rounded-full hover:bg-white/5"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Title</label>
                    <input
                      type="text"
                      {...register('name', { 
                        required: 'Title is required',
                        minLength: { value: 3, message: 'Minimum 3 characters required' }
                      })}
                      placeholder="Enter task title"
                      className={`w-full p-4 bg-[#111114] border ${errors.name ? 'border-red-500/50' : 'border-white/5 focus:border-[#8B7CFF]'} rounded-xl focus:outline-none text-white placeholder-zinc-700 transition-all`}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-500 font-medium">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                    <textarea
                      {...register('description')}
                      placeholder="Add description..."
                      rows={4}
                      className="w-full p-4 bg-[#111114] border border-white/5 focus:border-[#8B7CFF] rounded-xl focus:outline-none text-white placeholder-zinc-700 transition-all resize-none"
                    />
                  </div>

                  {!editId && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Images (Required)</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        {...register('images', { required: 'At least one image is required' })}
                        className={`w-full p-3 bg-[#111114] border ${errors.images ? 'border-red-500/50' : 'border-white/5 focus:border-[#8B7CFF]'} rounded-xl focus:outline-none text-zinc-300 transition-all file:mr-4 file:py-2.5 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-white file:text-black hover:file:bg-gray-200 file:cursor-pointer`}
                      />
                      {errors.images && (
                        <p className="mt-2 text-sm text-red-500 font-medium">
                          {errors.images.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-10 flex flex-col-reverse sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3.5 rounded-xl font-bold text-zinc-400 hover:text-white hover:bg-[#1A1A20] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-black px-8 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 min-w-[140px]"
                  >
                    {isSubmitting ? (
                      <Loader2 size={20} className="animate-spin text-black" />
                    ) : editId ? 'Save Changes' : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
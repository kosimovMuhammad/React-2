import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  Loader2, 
  X, 
  Zap, 
  Edit2
} from 'lucide-react';
import {
  useGetTodosQuery,
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from '../store/todoApi';

// ==========================================
// 3D TILT CARD COMPONENT
// ==========================================
const TiltCard: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className, style }) => {
  const [transform, setTransform] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Кунҷи гардиш (rotate)
    const rotateX = -((y - centerY) / centerY) * 7; 
    const rotateY = ((x - centerX) / centerX) * 7;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(0.98, 0.98, 0.98)`);
  };

  const handleMouseLeave = () => {
    setTransform('');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        ...style,
        transform: transform || 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: transform 
          ? 'transform 0.05s linear' 
          : 'transform 0.5s ease-out, border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
      }}
    >
      {children}
    </div>
  );
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export const TodoList: React.FC = () => {
  // RTK Query Hooks
  const { data: todos = [], isLoading, isFetching, isError, error } = useGetTodosQuery();
  const [createTodo, { isLoading: isCreating }] = useCreateTodoMutation();
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  // UI & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<FileList | null>(null);

  // Filter
  const filteredTodos = todos.filter(todo => 
    todo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    todo.id?.toString() === searchQuery
  );

  const handleEditClick = (todo: any) => {
    setName(todo.name);
    setDescription(todo.description);
    setEditingId(todo.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setName('');
    setDescription('');
    setImages(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    try {
      if (editingId) {
        await updateTodo({
          id: editingId,
          name,
          description,
        }).unwrap();
      } else {
        await createTodo({
          name,
          description,
          images: images ? Array.from(images) : undefined,
        }).unwrap();
      }
      
      handleCloseModal();
      
      const fileInput = document.getElementById('todo-images') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Failed to save todo: ', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070709] flex justify-center items-center">
        <Loader2 className="animate-spin text-[#8B7CFF]" size={48} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#070709] flex justify-center items-center text-red-500 font-bold">
        Ошибка при загрузке задач: {JSON.stringify(error)}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#110e1a] via-[#070709] to-[#070709] p-6 md:p-10 text-zinc-100 font-sans selection:bg-[#8B7CFF]/30">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="flex items-center justify-center w-14 h-14 bg-[#1A1528] animate-logo-float transition-all duration-500 rounded-2xl relative">
              <Zap className="text-[#8B7CFF] drop-shadow-[0_0_8px_rgba(139,124,255,0.6)] group-hover:scale-110 transition-transform duration-300" size={28} />
              {isFetching && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B7CFF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#8B7CFF]"></span>
                </span>
              )}
            </div>
            <h1 className="text-4xl font-black tracking-tight flex items-center drop-shadow-[0_0_15px_rgba(139,124,255,0.2)]">
              <span className="animate-text-shine">Nexus Tasks</span>
            </h1>
          </div>
          
          <button
            onClick={() => {
              handleCloseModal();
              setIsModalOpen(true);
            }}
            className="group flex items-center gap-2 bg-white hover:bg-gray-200 text-black px-6 py-3.5 rounded-[1rem] font-bold transition-all duration-300 active:scale-90 hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)]"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            New Task
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
          <div className="group flex items-center bg-[#111114]/80 backdrop-blur-md border border-white/5 rounded-[1.25rem] p-2 focus-within:border-[#8B7CFF]/50 focus-within:shadow-[0_0_30px_rgba(139,124,255,0.15)] transition-all duration-500 hover:border-white/10">
            <div className="pl-4 pr-2 flex items-center justify-center">
              <Search className="text-zinc-500 group-focus-within:text-[#8B7CFF] transition-colors duration-300" size={22} />
            </div>
            <input
              type="text"
              placeholder="Search task by ID or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none text-zinc-100 placeholder-zinc-600 px-2 py-4 focus:outline-none text-lg"
            />
            <button className="bg-[#212126] hover:bg-[#3A2D5C] text-white px-8 py-3.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(139,124,255,0.5)] active:scale-95 font-bold hidden sm:block">
              Search
            </button>
          </div>
        </div>

        {/* TODO LIST GRID */}
        {filteredTodos.length === 0 ? (
          <div className="text-center py-20 text-zinc-600 animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#111114] mb-6 border border-white/5 shadow-inner">
              <Search size={32} className="opacity-30" />
            </div>
            <p className="text-2xl font-bold text-zinc-400">Задачи не найдены.</p>
            <p className="text-md mt-2">Добавьте новую задачу, чтобы начать.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTodos.map((todo, index) => (
              <TiltCard 
                key={todo.id} 
                className={`group relative p-6 sm:p-8 bg-[#0C0C0F]/80 backdrop-blur-sm border rounded-[1.5rem] flex flex-col h-full animate-in fade-in slide-in-from-bottom-8 ${
                  todo.isCompleted 
                    ? 'border-green-500/20 opacity-70 hover:opacity-100' 
                    : 'border-white/5 hover:bg-[#111114] hover:border-[#8B7CFF]/50 hover:shadow-[0_0_40px_-10px_rgba(139,124,255,0.3)] hover:z-10'
                }`}
                style={{ animationFillMode: 'both', animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-1 flex flex-col relative z-10">
                  {/* Card Header */}
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className={`font-bold text-2xl leading-tight transition-colors duration-300 ${
                      todo.isCompleted 
                        ? 'text-zinc-500 line-through' 
                        : 'text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#8B7CFF]'
                    }`}>
                      {todo.name}
                    </h3>
                    <span className="shrink-0 bg-[#1A1A20] text-zinc-500 group-hover:text-[#8B7CFF] transition-colors duration-300 text-xs px-2.5 py-1.5 rounded-lg font-mono">
                      #{todo.id}
                    </span>
                  </div>
                  
                  {/* Description */}
                  <p className={`text-sm leading-relaxed mb-6 flex-1 transition-colors duration-300 ${
                    todo.isCompleted ? 'text-zinc-600' : 'text-zinc-400 group-hover:text-zinc-300'
                  }`}>
                    {todo.description}
                  </p>
                  
                  {/* Images indicator logic */}
                  {todo.images && todo.images.length > 0 && (
                    <div className="mb-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141418] border border-white/5 group-hover:border-[#8B7CFF]/30 transition-colors duration-300 text-xs text-zinc-400 font-medium">
                        <Zap size={12} className="text-[#8B7CFF] animate-pulse" /> 
                        Вложений: {todo.images.length}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons (Edit & Delete) */}
                <div className="flex items-center gap-3 mt-auto pt-2 relative z-10 sm:opacity-0 sm:-translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <button
                    onClick={() => handleEditClick(todo)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#141418] hover:bg-blue-500/10 text-zinc-400 hover:text-blue-500 border border-transparent hover:border-blue-500/30 rounded-xl transition-all duration-300 active:scale-95 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] font-medium text-sm"
                  >
                    <Edit2 size={18} /> Изменить
                  </button>
                  
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#141418] hover:bg-red-500/10 text-zinc-400 hover:text-red-500 border border-transparent hover:border-red-500/30 rounded-xl transition-all duration-300 active:scale-95 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] font-medium text-sm"
                  >
                    <Trash2 size={18} /> Удалить
                  </button>
                </div>
              </TiltCard>
            ))}
          </div>
        )}

        {/* MODAL FOR NEW TASK */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
              onClick={handleCloseModal}
            />
            
            <div className="relative w-full max-w-lg bg-[#0C0C0F] border border-[#3A2D5C] rounded-[2rem] shadow-[0_0_50px_-10px_rgba(139,124,255,0.2)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8B7CFF] to-transparent opacity-50" />
              
              <div className="flex justify-between items-center p-8 border-b border-white/5">
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {editingId ? 'Изменить задачу' : 'Новая задача'}
                </h2>
                <button 
                  onClick={handleCloseModal}
                  className="text-zinc-500 hover:text-red-500 transition-all duration-300 p-2 rounded-full hover:bg-red-500/10 hover:rotate-90"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8">
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-xs font-bold tracking-widest text-zinc-500 uppercase mb-2 group-focus-within:text-[#8B7CFF] transition-colors">Название</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Название задачи"
                      maxLength={100}
                      required
                      className="w-full p-4 bg-[#111114] border border-white/5 rounded-xl focus:outline-none focus:border-[#8B7CFF] focus:ring-1 focus:ring-[#8B7CFF]/50 text-white placeholder-zinc-700 transition-all text-lg"
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-xs font-bold tracking-widest text-zinc-500 uppercase mb-2 group-focus-within:text-[#8B7CFF] transition-colors">Описание</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Описание задачи"
                      rows={4}
                      maxLength={1000}
                      required
                      className="w-full p-4 bg-[#111114] border border-white/5 focus:border-[#8B7CFF] focus:ring-1 focus:ring-[#8B7CFF]/50 rounded-xl focus:outline-none text-white placeholder-zinc-700 transition-all resize-none text-lg"
                    />
                  </div>

                  {!editingId && (
                    <div className="group">
                      <label className="block text-xs font-bold tracking-widest text-zinc-500 uppercase mb-2 group-focus-within:text-[#8B7CFF] transition-colors">Изображения (опционально)</label>
                      <input
                        id="todo-images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setImages(e.target.files)}
                        className="w-full p-3 bg-[#111114] border border-white/5 focus:border-[#8B7CFF] rounded-xl focus:outline-none text-zinc-300 transition-all file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#8B7CFF]/10 file:text-[#8B7CFF] hover:file:bg-[#8B7CFF]/20 hover:file:shadow-[0_0_15px_rgba(139,124,255,0.3)] file:cursor-pointer file:transition-all"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-10 flex flex-col-reverse sm:flex-row justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3.5 rounded-xl font-bold text-zinc-500 hover:text-white hover:bg-[#1A1A20] transition-all active:scale-95"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-black px-8 py-3.5 rounded-xl font-bold transition-all duration-300 active:scale-90 hover:scale-105 disabled:opacity-50 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] min-w-[180px]"
                  >
                    {isCreating || isUpdating ? (
                      <Loader2 size={20} className="animate-spin text-black" />
                    ) : editingId ? 'Сохранить' : 'Добавить задачу'}
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
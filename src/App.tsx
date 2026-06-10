import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchToDos, type ToDo } from "./store/slices/todoSlice";
import { TodoItem } from "./components/TodoItem";
import { TodoModal } from "./components/TodoModal";
import { Loader2, Plus, CheckSquare } from "lucide-react";

function App() {
  const dispatch = useAppDispatch();
  const { todos, status } = useAppSelector((state) => state.todos);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ToDo | null>(null);

  useEffect(() => {
    dispatch(fetchToDos());
  }, [dispatch]);

  const handleEditTodo = (todo: ToDo) => {
    setTodoToEdit(todo);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setTodoToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0f0c1b] text-zinc-200 font-sans p-6 md:p-10 selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 bg-[#1a1625] rounded-3xl p-6 border border-white/5 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-pink-500 p-3 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <CheckSquare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Nexus Tasks
              </h1>
              <p className="text-zinc-500 font-medium">Your premium workspace</p>
            </div>
          </div>
          <button 
            onClick={openCreateModal}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#231e32] hover:bg-[#2a243b] text-white font-bold transition-all border border-transparent hover:border-indigo-500/30 flex items-center justify-center gap-3 shadow-lg"
          >
            <Plus className="w-5 h-5 text-indigo-400" />
            New Item
          </button>
        </div>

        {/* Task List */}
        <div className="w-full">
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center py-20 text-indigo-400">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="text-lg font-medium">Loading Tasks...</p>
            </div>
          )}

          {status !== "loading" && todos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-[#1a1625] rounded-3xl border border-white/5 border-dashed">
              <div className="w-20 h-20 mb-6 rounded-2xl bg-[#231e32] flex items-center justify-center">
                <CheckSquare className="w-10 h-10 text-zinc-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">No items yet</h3>
              <p className="text-zinc-500 mb-8 text-center max-w-sm">
                Your workspace is completely empty. Create a new task to get started!
              </p>
              <button 
                onClick={openCreateModal}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold hover:opacity-90 shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center gap-2 transition-opacity"
              >
                <Plus className="w-5 h-5" />
                Create First Item
              </button>
            </div>
          )}

          {todos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} onEdit={handleEditTodo} />
              ))}
            </div>
          )}
        </div>
      </div>

      <TodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        todoToEdit={todoToEdit}
      />
    </div>
  );
}

export default App;
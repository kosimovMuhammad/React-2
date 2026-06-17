import React from "react"
import { AddTodoModal } from "@/components/modals/AddTodoModal"
import { EditTodoModal } from "@/components/modals/EditTodoModal"
import { DeleteTodoModal } from "@/components/modals/DeleteTodoModal"
import { getLoadableAtom } from "@/store/TodoAtom"
import { useAtomValue } from "jotai"

export default function App() {
  const value = useAtomValue(getLoadableAtom)

  if (value.state === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold animate-pulse">Loading...</div>
      </div>
    )
  }

  if (value.state === "hasError") {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error loading data
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
         
        </h1>
        <AddTodoModal />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {value?.data?.map((todo: any) => (
          <div 
            key={todo.id} 
            className={`p-6 rounded-xl border flex flex-col bg-card text-card-foreground shadow-sm transition-all hover:shadow-md ${todo.isCompleted ? 'opacity-60 grayscale-[0.5]' : ''}`}
          >
            {todo.images && todo.images.length > 0 && (
              <img 
                src={`https://to-dos-api.softclub.tj/images/${todo.images[0].imageName}`} 
                alt={todo.name} 
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            <div className="flex justify-between items-start mb-4">
              <h2 className={`text-xl font-semibold leading-none tracking-tight ${todo.isCompleted ? 'line-through' : ''}`}>
                {todo.name}
              </h2>
              <span className={`px-2 py-1 rounded text-xs font-medium ${todo.isCompleted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {todo.isCompleted ? 'Completed' : 'Pending'}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
              {todo.description}
            </p>

            <div className="flex gap-2 mt-auto pt-4 border-t">
              <EditTodoModal todo={todo} />
              <DeleteTodoModal id={todo.id} name={todo.name} />
            </div>
          </div>
        ))}
      </div>
      
      {value?.data?.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No tasks found. Click "Add New To-Do" to get started.
        </div>
      )}
    </div>
  )
}

import { Formik, useFormik } from "formik"
import { useState } from "react"
 import * as Yup from 'yup';

const App = () => {
  const [data, setData] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editIndex, setEditIndex] = useState(null)

  const { handleSubmit, values, handleChange, setValues, resetForm ,touched,errors} = useFormik({
    initialValues: {
      name: "",
      age: ""
    },
      validationSchema: Yup.object({
       name: Yup.string()
         .max(15, 'Must be 15 characters or less')
         .min(5, 'Must be 5 characters or more')
         .required('Required'),
       age: Yup.number()
         .required('Required'),
     }),
    onSubmit: (values) => {
      if (isEditing) {
        const updatedData = [...data]
        updatedData[editIndex] = values
        setData(updatedData)
        setIsEditing(false)
        setEditIndex(null)
      } else {
        setData(prev => [...prev, values])
      }
      resetForm()
    }
  })

  const handleEdit = (index) => {
    setIsEditing(true)
    setEditIndex(index)
    setValues({
      name: data[index].name,
      age: data[index].age
    })
  }

  const handleDelete = (index) => {
    setData(prev => prev.filter((_,i) => i !== index))
    
    if (isEditing && editIndex === index) {
      setIsEditing(false)
      setEditIndex(null)
      resetForm()
    }
  }

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-xl shadow-sm border border-slate-100 font-sans">
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
            <input 
              type="text" 
              value={values.name} 
              name="name" 
              onChange={handleChange} 
              placeholder="Алишер"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
             {touched.name && errors.name ? (
         <div>{errors.name}</div>
       ) : null}
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Age</label>
            <input 
              type="number" 
              value={values.age} 
              name="age" 
              onChange={handleChange} 
              placeholder="23"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {touched.age && errors.age ? (
         <div>{errors.age}</div>
       ) : null}
          </div>
        </div>

        <button 
          type="submit" 
          className={`w-full text-white text-sm font-medium py-2 rounded-lg transition-colors shadow-sm ${
            isEditing ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isEditing ? "Save" : "Add"}
        </button>
      </form>

      {data.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-100 space-y-2">
         
          {data.map((item, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center px-3 py-2 bg-slate-50 rounded-lg text-sm border border-slate-100"
            >
              <div>
                <span className="font-medium text-slate-700 block">{item.name}</span>
                <span className="text-xs text-slate-400">{item.age}</span>
              </div>
              
              <div className="flex gap-1.5">
                <button 
                  type="button"
                  onClick={() => handleEdit(index)}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-2xs transition-colors"
                >
                  Edit
                </button>
                
                <button 
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="text-xs font-medium text-rose-600 hover:text-rose-800 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-2xs transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default App  
import { useState } from "react";
import { TodoItem } from "./components/TodoItem";
import { AddTodo } from "./components/AddTodo";
import ToggleTheme from "./components/ToggleTheme";
import { getInitialTheme } from "./components/helpers/getInitialTheme";
import { toggleTheme } from "./components/helpers/toggleTheme";

function App() {
  
  const initialTodos = [
    { id: 1, text: 'Реакт'},
    { id: 2, text: 'Туду'},
    { id: 3, text: 'Деплой'}
  ]

  const [todos, setTodos] = useState(initialTodos)
  const [theme, setTheme] = useState(getInitialTheme())



  const onAdd = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
    };
    setTodos([...todos, newTodo]);
  }
  
  const onDelete = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }

  return (
    <div data-theme={theme} 
    className="flex flex-col min-h-screen justify-center items-center 
    bg-page-light dark:bg-page-dark p-6">
      <ToggleTheme toggleTheme={() => toggleTheme(setTheme)} theme={theme}/>
      <div className="mx-auto flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white 
        mb-8 duration-300"><span className="bg-clip-text text-transparent bg-linear-to-r 
        from-red-600 to-pink-400">My Todo App</span></h1>
        <AddTodo onAdd={onAdd}/>
        <div className="dark:text-white">Task List</div>
        <div className="flex flex-col gap-3">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onDelete={onDelete} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App;

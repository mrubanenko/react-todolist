import { useEffect, useState } from "react";
import { TodoItem } from "./components/TodoItem";
import { AddTodo } from "./components/AddTodo";
import ToggleTheme from "./components/ToggleTheme";
import { getInitialTheme } from "./components/helpers/getInitialTheme";
import { toggleTheme } from "./components/helpers/toggleTheme";

const LOCAL_STORAGE_KEY = "todos";
const API_URL = "https://692f04bc91e00bafccd64475.mockapi.io/api/v1/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    const loadInitialData = async () => {
      const savedTodos = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"
      );
      setTodos(savedTodos);

      try {
        const response = await fetch(API_URL);

        if (response.ok) {
          const serverTodos = await response.json();
          setTodos(serverTodos);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serverTodos));
        }
      } catch (error) {
        console.error("Loading data error", error);
      }
    };
    loadInitialData();
  }, []);

  const onAdd = async (text, deadline) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      deadline: deadline || null,
      order: todos.length + 1,
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });

      const createdTodo = await response.json();

      const syncedTodos = updatedTodos.map((todo) =>
        todo.id === newTodo.id ? createdTodo : todo
      );

      setTodos(syncedTodos);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(syncedTodos));
    } catch (error) {
      console.error("Adding Error", error);
      setTodos(todos);
    }
  };

  const toggleComplete = async (id) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);

    if (!todoToUpdate) return;

    const updatedTodo = {
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    };

    const updatedTodos = todos.map((todo) =>
      todo.id === id ? updatedTodo : todo
    );

    setTodos(updatedTodos);

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTodo),
      });

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
    } catch (error) {
      console.log("Update Error", error);
      setTodos(todos);
    }
  };

  const onDelete = async (id) => {
    const previousTodos = todos;
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
    } catch (error) {
      console.error("Delete Error", error);
      setTodos(previousTodos);
    }
  };

  return (
    <div
      data-theme={theme}
      className="flex flex-col min-h-screen justify-center items-center 
    bg-page-light dark:bg-page-dark p-6"
    >
      <ToggleTheme toggleTheme={() => toggleTheme(setTheme)} theme={theme} />
      <div className="mx-auto flex flex-col gap-3">
        <h1
          className="text-3xl font-bold text-center text-gray-900 dark:text-white 
        mb-8 duration-300"
        >
          <span
            className="bg-clip-text text-transparent bg-linear-to-r 
        from-red-600 to-pink-400"
          >
            My Todo App
          </span>
        </h1>
        <AddTodo onAdd={onAdd} />
        <div className="dark:text-white">Task List</div>
        <div className="flex flex-col gap-3">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              onToggleComplete={toggleComplete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

import { useState } from "react";
import { TodoItem } from "./components/TodoItem";
import { AddTodo } from "./components/AddTodo";
import ToggleTheme from "./components/ToggleTheme";
import { getInitialTheme } from "./components/helpers/getInitialTheme";
import { toggleTheme } from "./components/helpers/toggleTheme";
import DeleteModal from "./components/DeleteModal";
import { useTodoManager } from "./hooks/useTodoManager";

function App() {
  const [theme, setTheme] = useState(getInitialTheme());

  const {
    todos,
    deletingId,
    setDeletingId,
    setIsDeletingCompleted,
    isDeletingCompleted,
    onAdd,
    handleUpdate,
    toggleComplete,
    handleDelete,
    handleDeleteCompleted,
    hasCompletedTodos,
    confirmDeleteCompleted,
  } = useTodoManager();

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
              onDelete={() => setDeletingId(todo.id)}
              onToggleComplete={toggleComplete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      </div>
      {deletingId && (
        <DeleteModal
          onCancel={() => {
            setDeletingId(null);
          }}
          onConfirm={() => {
            handleDelete(deletingId);
            setDeletingId(null);
          }}
          message="Are you sure you want to remove this task?"
        />
      )}
      {isDeletingCompleted && (
        <DeleteModal
          onCancel={() => {
            setIsDeletingCompleted(false);
          }}
          onConfirm={confirmDeleteCompleted}
          message={`Are you sure you want to remove all completed tasks (${
            todos.filter((todo) => todo.completed).length
          })?`}
        />
      )}
      {hasCompletedTodos && (
        <button
          onClick={handleDeleteCompleted}
          className="px-4 py-2 mt-6 bg-green-700 hover:bg-green-600 text-white rounded opacity-90 transition-colors cursor-pointer"
        >
          Clear completed tasks
        </button>
      )}
    </div>
  );
}

export default App;

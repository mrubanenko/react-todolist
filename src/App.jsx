import { useState } from "react";
import ToggleTheme from "./components/ToggleTheme";
import { getInitialTheme } from "./components/helpers/getInitialTheme";
import { toggleTheme } from "./components/helpers/toggleTheme";
import DeleteModal from "./components/DeleteModal";
import { useTodoManager } from "./hooks/useTodoManager";
import DeleteCompletedBtn from "./components/DeteleCompletedBtn";
import MainContent from "./components/MainContent";

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
      <MainContent
        onAdd={onAdd}
        todos={todos}
        handleUpdate={handleUpdate}
        toggleComplete={toggleComplete}
        setDeletingId={setDeletingId}
      />
      {
        <DeleteModal
          deletingId={deletingId}
          onCancel={() => {
            setDeletingId(null);
          }}
          onConfirm={() => {
            handleDelete(deletingId);
            setDeletingId(null);
          }}
          message="Are you sure you want to remove this task?"
        />
      }
      {
        <DeleteModal
          isDeletingCompleted={isDeletingCompleted}
          onCancel={() => {
            setIsDeletingCompleted(false);
          }}
          onConfirm={confirmDeleteCompleted}
          message={`Are you sure you want to remove all completed tasks (${
            todos.filter((todo) => todo.completed).length
          })?`}
        />
      }
      {hasCompletedTodos && (
        <DeleteCompletedBtn
          handleDeleteCompleted={handleDeleteCompleted}
          hasCompletedTodos={hasCompletedTodos}
        />
      )}
    </div>
  );
}

export default App;

import Header from "./Header";
import { AddTodo } from "./AddTodo";
import TodoList from "./TodoList";

const MainContent = ({
  onAdd,
  todos,
  handleUpdate,
  toggleComplete,
  setDeletingId,
}) => {
  return (
    <div className="mx-auto flex flex-col gap-3">
      <Header />
      <AddTodo onAdd={onAdd} />
      <TodoList
        todos={todos}
        handleUpdate={handleUpdate}
        toggleComplete={toggleComplete}
        setDeletingId={setDeletingId}
      />
    </div>
  );
};

export default MainContent;

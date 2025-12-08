import { TodoItem } from "./TodoItem";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const TodoList = ({
  todos,
  handleUpdate,
  toggleComplete,
  setDeletingId,
  onOrder,
}) => {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id !== over.id) {
      onOrder(active.id, over?.id);
    }
  };
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={todos.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
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
        </div>{" "}
      </SortableContext>
    </DndContext>
  );
};

export default TodoList;

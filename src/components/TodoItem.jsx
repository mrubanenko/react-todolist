import { useCallback, useState } from "react";
import Checkbox from "./Checkbox";
import EditForm from "./EditForm";
import TextDisplay from "./TextDisplay";
import DeleteButton from "./DeleteButton";
import { useSortable } from "@dnd-kit/sortable";

export const TodoItem = ({ todo, onDelete, onToggleComplete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDeadline, setEditDeadline] = useState(todo.deadline || "");

  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: todo.id,
    });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    transition,
    zIndex: transform ? 1 : "auto",
  };

  const handleToggle = () => {
    onToggleComplete(todo.id);
  };

  const handleSave = useCallback(() => {
    if (editText.trim()) {
      onUpdate(todo.id, editText, editDeadline);
    }
    setIsEditing(false);
  }, [editText, editDeadline, todo.id, onUpdate]);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      className="group flex items-center  p-4 gap-3 bg-white dark:bg-page-dark
        rounded-lg shadow-sm hover:shadow-md border border-gray-200"
    >
      <div {...listeners} className="h-6 w-4 border-l-6 border-r-6 border-gray-300 border-dotted cursor-grab active:cursor-grabbing"></div>
      <div className="flex items-center gap-3 flex-1">
        <Checkbox handleToggle={handleToggle} completed={todo.completed} />
        {isEditing ? (
          <EditForm
            editText={editText}
            editDeadline={editDeadline}
            handleSave={handleSave}
            setEditText={setEditText}
            setEditDeadline={setEditDeadline}
          />
        ) : (
          <TextDisplay todo={todo} setIsEditing={setIsEditing} />
        )}
      </div>
      <DeleteButton onClick={() => onDelete(todo.id)} />
    </div>
  );
};

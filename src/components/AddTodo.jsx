import { useState } from "react";

export function AddTodo({ onAdd }) {
  const [text, setText] = useState("");
  const [deadline, setDeadLine] = useState("");
  const [showDeadLineInput, setShowDeadLineInput] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text, deadline);
      setText("");
      setDeadLine("");
      setShowDeadLineInput("");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div
        className="flex item-center bg-white rounded-lg shadow-sm overflow-hidden
        border border-gray-100 focus-within:ring-2 ring-blue-200"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add Task"
          className="flex-1 p-3 text-gray-700 dark:bg-page-dark dark:text-white
        outline-none placeholder-gray-300"
        />
        <button
          type="submit"
          className="p-3 bg-btn-light hover:bg-btn-light-hv
        text-white dark:bg-btn-dark hover:dark:bg-btn-dark-hv transition-colors duration-300 cursor-pointer"
        >
          +
        </button>
      </div>
      {showDeadLineInput && (
        <div className="flex items-center gap-2 text-gray-300  mt-2">
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadLine(e.target.value)}
            className="p-2 border rounded flex-1"
          />
          <button
            type="button"
            onClick={() => {
              setDeadLine("");
              setShowDeadLineInput(false);
            }}
            className="p-2 hover:text-blue-700"
          >
            Cancel
          </button>
        </div>
      )}
      {!showDeadLineInput && (
        <button
          type="button"
          onClick={() => {
            setShowDeadLineInput(true);
          }}
          className="self-start p-2 text-blue-500 hover:text-blue-400"
        >
          + Add deadline
        </button>
      )}
    </form>
  );
}

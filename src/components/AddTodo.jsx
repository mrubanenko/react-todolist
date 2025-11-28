import { useState } from "react";

export function AddTodo( { onAdd }) {
    const [text, setText] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        if(text.trim()) {
            onAdd(text);
            setText("");
        }
    }
    return <form onSubmit={handleSubmit} className="mb-6" >
        <div className="flex item-center bg-white rounded-lg shadow-sm overflow-hidden
        border border-gray-100 focus-within:ring-2 ring-blue-200">
            <input 
        type="text" 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder="Add Task"
        className="flex-1 p-3 text-gray-700 dark:bg-page-dark dark:text-white
        outline-none placeholder-gray-300"
        />
        <button type="submit" className="p-3 bg-btn-light hover:bg-btn-light-hv
        text-white dark:bg-btn-dark hover:dark:bg-btn-dark-hv transition-colors duration-300 cursor-pointer">+</button>
        </div>
    </form>;
}
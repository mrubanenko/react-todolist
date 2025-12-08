import { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "todos";
const API_URL = "https://692f04bc91e00bafccd64475.mockapi.io/api/v1/todos";

export const useTodoManager = () => {
  const [todos, setTodos] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeletingCompleted, setIsDeletingCompleted] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      const savedTodos = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"
      );

      const sortedSavedTodos = [...savedTodos].sort(
        (a, b) => a.order - b.order
      );
      setTodos(sortedSavedTodos);

      try {
        const response = await fetch(API_URL);

        if (response.ok) {
          const serverTodos = await response.json();
          const sortedServerTodos = [...serverTodos].sort(
            (a, b) => a.order - b.order
          );
          setTodos(sortedServerTodos);

          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sortedServerTodos));
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

  const handleUpdate = async (id, text, deadline) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);

    if (!todoToUpdate) return;

    const updatedTodo = {
      ...todoToUpdate,
      text: text,
      deadline: deadline,
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

  const handleDelete = async (id) => {
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

  const hasCompletedTodos = todos.some((todo) => todo.completed);

  const handleDeleteCompleted = () => {
    if (!hasCompletedTodos) return;
    setIsDeletingCompleted(true);
  };

  const confirmDeleteCompleted = async () => {
    const originalTodos = [...todos];

    const completedIds = originalTodos
      .filter((t) => t.completed)
      .map((t) => t.id);

    setTodos(originalTodos.filter((todo) => !todo.completed));

    const failedIds = [];

    for (const id of completedIds) {
      try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      } catch (error) {
        console.error(`Delete Task Error ${id}:`, error);
        failedIds.push(id);
      }
    }

    if (failedIds.length > 0) {
      setTodos(
        originalTodos.filter(
          (todo) => !todo.completed || failedIds.includes(todo.id)
        )
      );
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
    setIsDeletingCompleted(false);
  };
  const onOrder = (activeId, overId) => {
    if (!overId) return;

    const activeIndex = todos.findIndex((todo) => todo.id === activeId);
    const overIndex = todos.findIndex((todo) => todo.id === overId);
    if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex)
      return;

    const newTodos = [...todos];
    const [movedTodo] = newTodos.splice(activeIndex, 1);
    newTodos.splice(overIndex, 0, movedTodo);

    const updatedTodos = newTodos.map((todo, index) => ({
      ...todo,
      order: index + 1,
    }));

    setTodos(updatedTodos);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));

    updatedTodos.forEach((todo) => {
      fetch(`${API_URL}/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: todo.order }),
      }).catch((err) => console.log("Update order failed", err));
    });
  };

  return {
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
    onOrder,
  };
};

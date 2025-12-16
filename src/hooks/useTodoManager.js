import { useState, useEffect } from "react";
import {
  createNewTodo,
  sortedSavedTodos,
  toggleTodoCompletion,
  updateTodoData,
} from "../helpers/todoHelpers";
import { loadFromLocalStorage, savedToLocalStorage } from "../helpers/storage";
import { createTodo, deleteTodo, fetchTodos, updateTodo } from "../api/todoApi";

export const useTodoManager = () => {
  const [todos, setTodos] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeletingCompleted, setIsDeletingCompleted] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      const savedTodos = sortedSavedTodos(loadFromLocalStorage());

      setTodos(savedTodos);

      try {
        const serverTodos = await fetchTodos();
        const sortedServerTodos = sortedSavedTodos(serverTodos);
        setTodos(sortedServerTodos);
        savedToLocalStorage(sortedServerTodos);
      } catch (error) {
        console.error("Loading data error", error);
      }
    };
    loadInitialData();
  }, []);

  const onAdd = async (text, deadline) => {
    const newTodo = createNewTodo(text, deadline, todos.length + 1);

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    savedToLocalStorage(updatedTodos);

    try {
      const createdTodo = await createTodo(newTodo);

      const syncedTodos = updatedTodos.map((todo) =>
        todo.id === newTodo.id ? createdTodo : todo
      );

      setTodos(syncedTodos);
      savedToLocalStorage(syncedTodos);
    } catch (error) {
      console.error("Adding Error", error);
      setTodos(todos);
    }
  };

  const handleUpdate = async (id, text, deadline) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);

    if (!todoToUpdate) return;

    const updatedTodo = updateTodoData(todoToUpdate, text, deadline);
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? updatedTodo : todo
    );

    setTodos(updatedTodos);

    try {
      await updateTodo(id, updatedTodo);
      savedToLocalStorage(updatedTodos);
    } catch (error) {
      console.log("Update Error", error);
      setTodos(todos);
    }
  };

  const toggleComplete = async (id) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);

    if (!todoToUpdate) return;

    const updatedTodo = toggleTodoCompletion(todoToUpdate);

    const updatedTodos = todos.map((todo) =>
      todo.id === id ? updatedTodo : todo
    );

    setTodos(updatedTodos);

    try {
      await updateTodo(id, updatedTodo);

      savedToLocalStorage(updatedTodos);
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
      await deleteTodo(id);
      savedToLocalStorage(updatedTodos);
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
        await deleteTodo(id);
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

    savedToLocalStorage(todos);
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
    savedToLocalStorage(updatedTodos);

    updatedTodos.forEach((todo) => {
      updateTodo(todo.id, { order: todo.order }).catch((err) =>
        console.log("Update order failed", err)
      );
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

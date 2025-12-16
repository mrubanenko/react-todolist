import { useState, useEffect } from "react";
import {
  createNewTodo,
  sortedSavedTodos,
  toggleTodoCompletion,
  updateTodoData,
} from "../helpers/todoHelpers";
import { loadFromLocalStorage, savedToLocalStorage } from "../helpers/storage";
import { createTodo, deleteTodo, fetchTodos, updateTodo } from "../api/todoApi";
import { useTodoActions } from "./useTodoAction";

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

  const actions = useTodoActions({
    todos,
    setTodos,
    createNewTodo,
    createTodo,
    savedToLocalStorage,
    updateTodoData,
    updateTodo,
    toggleTodoCompletion,
    deleteTodo,
    setIsDeletingCompleted,
  });

  return {
    todos,
    deletingId,
    setDeletingId,
    setIsDeletingCompleted,
    isDeletingCompleted,
    ...actions,
  };
};

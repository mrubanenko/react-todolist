import { API_URL } from "../constants/todos";

export const fetchTodos = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch todos");
  return response.json();
};

export const createTodo = async (todo) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  if (!response.ok) throw new Error("Failed to create todo");
  return response.json();
};

export const updateTodoData = (todo, newText, newDeadline) => ({
  ...todo,
  text: newText,
  deadline: newDeadline,
});

export const updateTodo = async (id, todo) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  if (!response.ok) throw new Error("Failed to update todo");
  return response.json();
};

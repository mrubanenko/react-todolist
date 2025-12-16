export const sortedSavedTodos = (todos) => {
  return [...todos].sort((a, b) => a.order - b.order);
};

export const createNewTodo = (text, deadline, order) => ({
  id: Date.now(),
  text,
  completed: false,
  createdAt: new Date().toISOString(),
  deadline: deadline || null,
  order,
});

export const updateTodoData = (todo, newText, newDeadline) => ({
  ...todo,
  text: newText,
  deadline: newDeadline,
});

export const toggleTodoCompletion = (todo) => ({
  ...todo,
  completed: !todo.completed,
});

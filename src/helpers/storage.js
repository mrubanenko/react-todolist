import { LOCAL_STORAGE_KEY } from "../constants/todos";

export const loadFromLocalStorage = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const savedToLocalStorage = (todos) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
}

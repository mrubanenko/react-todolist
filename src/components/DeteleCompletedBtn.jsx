const DeleteCompletedBtn = ({ handleDeleteCompleted, hasCompletedTodos }) => {
  if (!hasCompletedTodos) return null;
  return (
    <button
      onClick={handleDeleteCompleted}
      className="px-4 py-2 mt-6 bg-green-700 hover:bg-green-600 text-white rounded opacity-90 transition-colors cursor-pointer"
    >
      Clear completed tasks
    </button>
  );
};

export default DeleteCompletedBtn;

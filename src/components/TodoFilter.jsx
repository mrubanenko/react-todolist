const TodoFilter = ({ filter, setFilter }) => {
  const buttonClasses = (currentFilter) => `px-4 py-2 rounded transition-color cursor-pointer ${
    filter === currentFilter ? "bg-blue-500 text-white" : "bg-blue-200 hover:bg-blue-400"
  }`
  return (
    <div className="flex gap-5 justify-center ">
      <button onClick={() => setFilter("all")} className={buttonClasses("all")}>
        All
      </button>
      <button
        onClick={() => setFilter("active")}
        className={buttonClasses("active")}
      >
        Not completed
      </button>
      <button
        onClick={() => setFilter("completed")}
        className={buttonClasses("completed")}
      >
        Completed
      </button>
    </div>
  );
};

export default TodoFilter;

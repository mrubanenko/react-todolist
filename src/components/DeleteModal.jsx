const DeleteModal = ({
  onCancel,
  onConfirm,
  message,
  deletingId,
  isDeletingCompleted,
}) => {
  const showModal = deletingId || isDeletingCompleted;

  if (!showModal) return null;

  return (
    <>
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-black/50 z-4 backdrop-blur-xs"></div>
        <div className="relative flex h-full items-center justify-center p-4 z-5">
          <div className="p-6 rounded-lg shadow-xl max-w-md w-full mx-4 bg-white text-gray-800 dark:bg-gray-800 dark:text-white">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-7">{message}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;

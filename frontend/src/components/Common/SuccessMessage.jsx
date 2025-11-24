export default function SuccessMessage({ message, onClose, className = '' }) {
  if (!message) return null;

  return (
    <div
      className={`bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex justify-between items-center ${className}`}
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-green-700 hover:text-green-900 ml-4"
        >
          ×
        </button>
      )}
    </div>
  );
}



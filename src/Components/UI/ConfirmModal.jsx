import { Trash2, X } from "lucide-react";

const ConfirmModal = ({ open, onClose, onConfirm, title, description }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-2xl p-6 w-full max-w-md shadow-xl animate-fadeIn">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-one">{title}</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-muted-foreground hover:text-one" />
          </button>
        </div>

        {/* Body */}
        <p className="text-sm text-muted-foreground mb-6">
          {description}
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white flex items-center gap-2 hover:bg-red-700 transition"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

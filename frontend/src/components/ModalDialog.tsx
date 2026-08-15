interface ModalDialogProps {
  isOpen: boolean;
  type: "confirm" | "error";
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export default function ModalDialog({
  isOpen,
  type,
  title,
  message,
  confirmLabel = "OK",
  cancelLabel = "Tutup",
  onConfirm,
  onCancel,
}: ModalDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#e7d9c6] bg-[#fffdf9] p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold ${
              type === "confirm"
                ? "bg-[#f3ead9] text-[#6b4b21]"
                : "bg-[#fff1f0] text-[#b42318]"
            }`}
          >
            {type === "confirm" ? "!" : "×"}
          </div>
          <h3 className="text-lg font-bold text-[#2d1d14]">{title}</h3>
        </div>

        <p className="text-sm leading-6 text-[#7d6757]">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          {type === "confirm" && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-[#d9c2a7] bg-white px-4 py-2.5 text-sm font-semibold text-[#4f3218] transition hover:bg-[#f8f1e7]"
            >
              {cancelLabel}
            </button>
          )}

          {type === "error" && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-[#d9c2a7] bg-white px-4 py-2.5 text-sm font-semibold text-[#4f3218] transition hover:bg-[#f8f1e7]"
            >
              {cancelLabel}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-[#6b4b21] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4f3218]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

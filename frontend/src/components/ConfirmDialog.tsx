import { useEffect } from "react";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  iconClassName?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Bekräfta",
  cancelLabel = "Avbryt",
  iconClassName = "fi fi-rr-trash",
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  const titleId = "confirm-dialog-title";
  const descriptionId = description ? "confirm-dialog-desc" : undefined;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        className="w-96 max-w-full p-6 bg-Colors-card rounded-3xl shadow-[0px_8px_32px_0px_rgba(0,157,157,0.18)] inline-flex flex-col justify-start items-start"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="self-stretch pb-6 flex flex-col justify-start items-center gap-3 overflow-hidden">
          <div className="size-14 bg-red-500/20 rounded-[50px] inline-flex justify-center items-center gap-2.5">
            <i
              aria-hidden
              className={`${iconClassName} text-[24px] leading-none text-red-500`}
            />
          </div>
          <div className="flex flex-col justify-start items-center gap-2">
            <div
              id={titleId}
              className="justify-start text-Colors-foreground text-xl font-bold font-['DM_Sans']"
            >
              {title}
            </div>
            {description ? (
              <div
                id={descriptionId}
                className="justify-start text-Colors-muted-foreground text-sm font-normal font-['DM_Sans'] text-center"
              >
                {description}
              </div>
            ) : null}
          </div>
        </div>
        <div className="self-stretch h-11 inline-flex justify-start items-start gap-2 overflow-hidden">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 self-stretch rounded-3xl outline outline-1 -outline-offset-1 outline-Colors-border inline-flex flex-col justify-center items-center overflow-hidden hover:bg-Colors-muted/40 transition-colors"
          >
            <span className="text-center justify-center text-Colors-foreground text-base font-semibold font-['DM_Sans']">
              {cancelLabel}
            </span>
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 self-stretch bg-red-500 rounded-3xl shadow-[0px_4px_16px_0px_rgba(22,26,38,0.05),0px_1px_2px_0px_rgba(22,26,38,0.04)] outline outline-1 -outline-offset-1 outline-Colors-border inline-flex flex-col justify-center items-center hover:bg-red-600 transition-colors"
          >
            <span className="text-center justify-center text-Colors-card text-base font-semibold font-['DM_Sans']">
              {confirmLabel}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

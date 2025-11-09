import styles from "../styles/ConfirmDialog.module.scss";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "info";
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = "Potwierdź",
  cancelText = "Anuluj",
  onConfirm,
  onCancel,
  variant = "info",
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`${styles.confirmButton} ${styles[variant]}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

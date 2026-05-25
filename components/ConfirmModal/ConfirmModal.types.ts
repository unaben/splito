export type ConfirmModalProps = {
  title: string;
  body: string;
  warning?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

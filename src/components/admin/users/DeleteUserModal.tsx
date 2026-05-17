import { DeleteConfirmationModal } from "../../common/DeleteConfirmationModal";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteUserModal = ({ isOpen, onClose, onConfirm }: DeleteUserModalProps) => {
  return (
    <DeleteConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete User"
      description="This user and all their data will be permanently removed. This action cannot be undone."
      confirmLabel="Delete"
    />
  );
};

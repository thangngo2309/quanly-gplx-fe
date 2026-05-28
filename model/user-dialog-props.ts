import { CreateUserModel, UpdateMultiUserModel, UpdateUserModel, UserDataModel } from "@/model/user.model";

export interface CreateUserDialogProps {
    open: boolean;
    selectedIds: number[];
    onClose: () => void;
    onSave: ( formData: CreateUserModel ) => void;
}

export interface EditUserDialogProps {
  open: boolean;
  selectedId: number;
  onClose: () => void;
  onSave: ( formData: UpdateUserModel ) => void;
  data: UpdateUserModel;
}

export interface EditMultiUserDialogProps {
  open: boolean;
  selectedIds: number[];
  onClose: () => void;
  onSave: (
    userIds: number[],
    formData: UpdateMultiUserModel
  ) => void;
}

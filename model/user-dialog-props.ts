import { UserRole } from "@/enum/user.enum";
import { ChangePasswordForm, CreateUserModel, UpdateMultiUserModel, UpdateUserModel, UserDataModel } from "@/model/user.model";

export interface CreateUserDialogProps {
  open: boolean;
  role: UserRole;
  onClose: () => void;
  onSave: (formData: CreateUserModel) => void;
}

export interface EditUserDialogProps {
  open: boolean;
  selectedId: number;
  role: UserRole;
  onClose: () => void;
  onSave: ( formData: UpdateUserModel ) => void;
  data: UpdateUserModel;
}

export interface EditMultiUserDialogProps {
  open: boolean;
  selectedIds: number[];
  role: UserRole;
  onClose: () => void;
  onSave: (
    userIds: number[],
    formData: UpdateMultiUserModel
  ) => void;
}

export interface ChangePasswordDialogProps {
  open: boolean;
  user_id: number;
  onClose: () => void;
  onSave: (formData: ChangePasswordForm) => void;
}

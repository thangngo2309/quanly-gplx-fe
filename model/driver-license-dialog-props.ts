import { CreateDriverLicenseModel, DriverLicenseDataModel, DriverLicenseModel, UpdateDriverLicenseModel, UpdateMultiDriverLicenseModel } from "./driver-license.model";

export interface UserOption {
    user_id: number;
    citizen_id: string;
    fullname: string;
};

export interface CreateDriverLicenseDialogProps {
    open: boolean;
    users: UserOption[];
    onClose: () => void;
    onSave: (data: CreateDriverLicenseModel) => void;
};

export interface RenewDriverLicenseDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: UpdateDriverLicenseModel) => void;
    data: DriverLicenseDataModel | null;
}

export interface EditDriverLicenseDialogProps {
  open: boolean;
  users: UserOption[];
  onClose: () => void;
  onSave: ( formData: UpdateDriverLicenseModel ) => void;
  data?: DriverLicenseDataModel | null;
}

export interface EditMultiDriverLicenseDialogProps {
  open: boolean;
  selectedIds: number[];
  onClose: () => void;
  onSave: (
    userIds: number[],
    formData: UpdateMultiDriverLicenseModel
  ) => void;
}

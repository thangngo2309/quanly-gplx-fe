import { CarDataModel, CreateCarModel, UpdateCarModel, UpdateMultiCarModel} from "@/model/car.model";

export interface CreateCarDialogProps {
    open: boolean;
    selectedIds: number[];
    onClose: () => void;
    onSave: ( formData: CreateCarModel ) => void;
}

export interface EditCarDialogProps {
  open: boolean;
  selectedId: number;
  onClose: () => void;
  onSave: ( formData: UpdateCarModel ) => void;
  data?: CarDataModel | null;
}

export interface EditMultiCarDialogProps {
  open: boolean;
  selectedIds: number[];
  onClose: () => void;
  onSave: (
    userIds: number[],
    formData: UpdateMultiCarModel
  ) => void;
}

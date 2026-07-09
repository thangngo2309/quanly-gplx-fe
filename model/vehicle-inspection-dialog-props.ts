import { CreateVehicleInspectionModel, UpdateVehicleInspectionModel } from "./vehicle-inspection.model";

export interface CarOption {
    car_id: number;
    registrationNumber: string;
    brand: string;
    manufacturingYear: number;
    isActive: boolean;
}

export interface CreateVehicleInspectionDialogProps {
    open: boolean;
    cars: CarOption[];
    onClose: () => void;
    onSave: (data: CreateVehicleInspectionModel) => void;
}

export interface EditVehicleInspectionDialogProps {
    open: boolean;
    cars: CarOption[];
    onClose: () => void;
    onSave: (data: UpdateVehicleInspectionModel) => void;
    data?: CreateVehicleInspectionModel | null;
}
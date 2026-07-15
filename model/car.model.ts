import { MetaPaging } from "./meta-paging.model";

export interface CreateCarModel {
    registrationNumber: string;
    chassis_number: string;
    engine_number: string;
    vehicle_type: string;
    brand: string;
    category: string;
    manufacturingYear: number;
    owner: string;
    hasDualBrake: boolean | string;
    practiceVehicleLicenseNumber: string;
    practiceVehicleLicenseIssueDate: Date;
    practiceVehicleLicenseExpiryDate: Date;
    insuranceExpiryDate: Date;
    imeiDat: string;
    serialNumber: string;
    inspection_issue_date: Date;
    inspection_expiry_date: Date;
    duration: number;
}

export interface UpdateCarModel {
    registrationNumber?: string;
    chassis_number?: string;
    engine_number?: string;
    vehicle_type?: string;
    brand?: string;
    category?: string;
    manufacturingYear?: number;
    owner?: string;
    hasDualBrake?: boolean | string;
    practiceVehicleLicenseNumber?: string;
    practiceVehicleLicenseIssueDate?: Date;
    practiceVehicleLicenseExpiryDate?: Date;
    insuranceExpiryDate?: Date;
    imeiDat?: string;
    serialNumber?: string;
    isActive?: boolean | string;
}

export interface UpdateMultiCarModel {
    vehicle_type?: string;
    brand?: string;
    category?: string;
    manufacturingYear?: number;
    owner?: string;
    hasDualBrake?: boolean | string;
    practiceVehicleLicenseIssueDate?: Date;
    practiceVehicleLicenseExpiryDate?: Date;
    insuranceExpiryDate?: Date;
    isActive?: boolean | string;
}

export interface CarDataModel {
    car_id: number;
    registrationNumber: string;
    chassis_number: string;
    engine_number: string;
    vehicle_type: string;
    brand: string;
    category: string;
    manufacturingYear: number;
    owner: string;
    hasDualBrake: boolean;
    practiceVehicleLicenseNumber: string;
    practiceVehicleLicenseIssueDate: Date;
    practiceVehicleLicenseExpiryDate: Date;
    insuranceExpiryDate: Date;
    imeiDat: string;
    serialNumber: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CarModel {
    data: CarDataModel[];
    meta: MetaPaging;
}

export type FilterCarForm = {
    registrationNumber?: string;
    imeiDat?: string;
    active?: boolean | undefined;
    sortBy?: string | 'car_id';
    sortDirection?: 'ASC' | 'DESC';
};
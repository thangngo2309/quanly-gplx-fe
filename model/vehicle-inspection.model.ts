import { MetaPaging } from "./meta-paging.model";

export interface VehicleInspectionDataModel {
    vehicle_inspection_id: number;
    car_id: number;
    car: Car;
    inspection_issue_date: Date;
    inspection_expiry_date: Date;
    is_active: boolean;
    is_deleted: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface Car {
    car_id: number;
    registrationNumber: string;
    brand: string;
    manufacturingYear: number;
    isActive: boolean;
    isDelete: boolean;
}

export interface VehicleInspectionModel {
    data: VehicleInspectionDataModel[];
    meta: MetaPaging;
}

export interface CreateVehicleInspectionModel {
    car_id: number;
    inspection_issue_date: Date;
    inspection_expiry_date: Date;
}

export interface UpdateVehicleInspectionModel {
    car_id?: number;
    inspection_issue_date?: Date;
    inspection_expiry_date?: Date;
    is_active?: boolean;
}

export interface FilterVehicleInspection {
    registration_number?: string;
    is_active?: boolean;
    sort_by?: string;
    sort_direction?: 'ASC' | 'DESC';
}
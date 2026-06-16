import { MetaPaging } from "./meta-paging.model";

export interface CreateCarModel {
    registrationNumber: string;
    brand: string;
    category: string;
    manufacturingYear: number;
    owner: string;
    hasDualBrake: boolean | string;
    practiceVehicleLicenseNumber: string;
    practiceVehicleLicenseIssueDate: Date;
    practiceVehicleLicenseExpiryDate: Date;
    inspectionIssueDate: Date;
    inspectionExpiryDate: Date;
    insuranceExpiryDate: Date;
    imeiDat: string;
    serialNumber: string;
}

export interface UpdateCarModel {
    registrationNumber?: string;
    brand?: string;
    category?: string;
    manufacturingYear?: number;
    owner?: string;
    hasDualBrake?: boolean | string;
    practiceVehicleLicenseNumber?: string;
    practiceVehicleLicenseIssueDate?: Date;
    practiceVehicleLicenseExpiryDate?: Date;
    inspectionIssueDate?: Date;
    inspectionExpiryDate?: Date;
    insuranceExpiryDate?: Date;
    imeiDat?: string;
    serialNumber?: string;
    isActive?: boolean | string;
}

export interface UpdateMultiCarModel {
    brand?: string;
    category?: string;
    manufacturingYear?: number;
    owner?: string;
    hasDualBrake?: boolean | string;
    practiceVehicleLicenseIssueDate?: Date;
    practiceVehicleLicenseExpiryDate?: Date;
    inspectionIssueDate?: Date;
    inspectionExpiryDate?: Date;
    insuranceExpiryDate?: Date;
    isActive?: boolean | string;
}

export interface CarDataModel {
  car_id: number;
  registrationNumber: string;
  brand: string;
  category: string;
  manufacturingYear: number;
  owner: string;
  hasDualBrake: boolean;
  practiceVehicleLicenseNumber: string;
  practiceVehicleLicenseIssueDate: Date;
  practiceVehicleLicenseExpiryDate: Date;
  inspectionIssueDate: Date;
  inspectionExpiryDate: Date;
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
  registrationNumber: string;
  imeiDat: string;
  active: boolean | undefined;
  sortDirection: 'ASC' | 'DESC';
};
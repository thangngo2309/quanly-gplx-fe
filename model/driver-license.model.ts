import { MetaPaging } from "./meta-paging.model";

export interface DriverLicenseDataModel {
    driver_license_id: number;
    user_id: number; 
    license_number: string;
    issue_date: Date;
    expiry_date: Date;
    pass_date: Date;
    issue_place: string;
    is_active: boolean;
    is_deleted: boolean;
    created_at: Date;
    updated_at: Date;
    user: User;
}

export interface DriverLicenseModel {
    data: DriverLicenseDataModel[];
    meta: MetaPaging;
}

export interface CreateDriverLicenseModel {
    user_id: number;
    license_number: string;
    issue_date: Date;
    expiry_date: Date;
    pass_date: Date;
    issue_place: string;
}

export interface UpdateDriverLicenseModel {
    user_id?: number;
    license_number?: string;
    issue_date?: Date;
    expiry_date?: Date;
    pass_date?: Date;
    issue_place?: string;
    is_active?: boolean;
}

export interface UpdateMultiDriverLicenseModel {
    user_id?: number;
    issue_date?: Date;
    expiry_date?: Date;
    pass_date?: Date;
    issue_place?: string;
    is_active?: boolean;
}

export interface User{
    user_id: number;
    fullname: string;
    date_of_birth: Date;
    is_active: boolean;
    is_deleted: boolean;
}

export interface FilterDriverLicense {
    license_number?: string;
    fullname?: string;
    active?: boolean;
    sortDirection?: 'ASC' | 'DESC';
    sortBy?: string;
}
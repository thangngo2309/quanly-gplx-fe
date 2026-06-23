import { CreateDriverLicenseModel, FilterDriverLicense, UpdateDriverLicenseModel, UpdateMultiDriverLicenseModel } from "@/model/driver-license.model";
import api from "./axios.config";

export async function createDriverLicense(driverLicenseData: CreateDriverLicenseModel) {
    const response = await api.post('/driver-license', driverLicenseData);
    return response.data;
}

export async function getAllDriverLicense(filters?: FilterDriverLicense, page?: number, limit?: number) {
    const res = await api.post('/driver-license/find-all',
        { ...filters, },
        { params: { page, limit } }
    );
    return res.data;
}

export async function getDriverLicenseById(driver_license_id: number) {
    const res = await api.get(`/driver-license/${driver_license_id}`);
    return res.data;
}

export async function updateDriverLicense(driver_license_id: number, driverLicenseData: UpdateDriverLicenseModel) {
    const response = await api.patch(`/driver-license/${driver_license_id}`, driverLicenseData);
    return response.data;
}

export async function deleteDriverLicense(driver_license_id: number) {
    const response = await api.delete(`/driver-license/${driver_license_id}`);
    return response.data;
}

export async function updateMultipleDriverLicense(driver_license_ids: number[], driverLicenseData: UpdateMultiDriverLicenseModel) {
    const response = await api.post('/driver-license/update-multiple', {
        driver_license_ids,
        data: driverLicenseData
    });
    return response.data;
}

export async function deleteMultipleDriverLicense(driver_license_ids: number[]) {
    const response = await api.post('/driver-license/delete-multiple', { driver_license_ids });
    return response.data;
}

export async function uniqueLicenseNumber(licenseNumber : string, id?: number) {
    const response = await api.post(`/driver-license/unique-license-number`, { licenseNumber, id });
    return response.data;
}

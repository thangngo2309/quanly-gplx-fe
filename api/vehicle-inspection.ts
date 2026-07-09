
import { CreateVehicleInspectionModel, FilterVehicleInspection, UpdateVehicleInspectionModel } from "@/model/vehicle-inspection.model";
import api from "./axios.config";

export async function createVehicleInspection(vehicleInspectionData: CreateVehicleInspectionModel) {
    const response = await api.post('/vehicle-inspection', vehicleInspectionData);
    return response.data;
}

export async function getAllVehicleInspection(filters?: FilterVehicleInspection, page?: number, limit?: number) {
    const res = await api.post('/vehicle-inspection/find-all',
        { ...filters },
        {params: { page, limit } }
    );
    return res.data;
}

export async function getVehicleInspectionById(vehicle_inspection_id: number) {
    const res = await api.get(`/vehicle-inspection/${vehicle_inspection_id}`);
    return res.data;
}

export async function updateVehicleInspection(vehicle_inspection_id: number, vehicleInspectionData: UpdateVehicleInspectionModel) {
    const response = await api.patch(`/vehicle-inspection/${vehicle_inspection_id}`, vehicleInspectionData);
    return response.data;
}

export async function deleteVehicleInspection(vehicle_inspection_id: number) {
    const response = await api.delete(`/vehicle-inspection/${vehicle_inspection_id}`);
    return response.data;
}
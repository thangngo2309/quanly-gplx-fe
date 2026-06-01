import { CarModel, CreateCarModel, FilterCarForm } from "@/model/car.model";
import api from "./axios.config";

export async function createCar(carData: CreateCarModel): Promise<CarModel> {
    try {
        const response = await api.post('/car', carData);
        return response.data;
    } catch (error) {
        console.error('Có lỗi khi tạo xe:', error);
        throw error;
    }
}

export async function getAllCar(filters?: FilterCarForm, page?: number, limit?: number): Promise<CarModel> {
    const res = await api.post<CarModel>('/car/find-all', 
        { ...filters,},
        { params: { page, limit }}
    );
    return res.data;
}

export async function getCarById(carId: number): Promise<CarModel> {
    const res = await api.get<CarModel>(`/car/${carId}`);
    return res.data;
}

export async function updateCar(carId: number, carData: Partial<CreateCarModel>) {
    const response = await api.patch(`/car/${carId}`, carData);
    return response.data;
}

export async function deleteCar(carId: number) {
    const response = await api.delete(`/car/${carId}`);
    return response.data;
}

export async function updateMultipleCar(car_ids: number[], carData: Partial<CreateCarModel>) {
    const response = await api.post('/car/update-multiple', {
        car_ids,
        data: carData
    });
    return response.data;
}

export async function deleteMultipleCar(car_ids: number[]) {
    const response = await api.post('/car/delete-multiple', { car_ids });
    return response.data;
}
import api from "./axios.config";
import { toast } from "react-toastify";
import { CreateUserModel, UpdateMultiUserModel, UpdateUserModel, UserModel } from "@/model/user.model";
import {FilterUserForm} from '@/model/user.model';

export async function createUser(userData: CreateUserModel): Promise<UserModel> {
    try {
        const response = await api.post('/user', userData);
        return response.data;
    } catch (error) {
        toast.error('Có lỗi xảy ra khi tạo người dùng');
        throw error;
    }
}

export async function getAllUser(filters?: FilterUserForm, page?: number, limit?: number): Promise<UserModel> {
    const res = await api.post<UserModel>('/user/find-all', 
        { ...filters,},
        { params: { page, limit }}
    );
    return res.data;
}

export async function getUserById(userId: number): Promise<UserModel> {
    const res = await api.get<UserModel>(`/user/${userId}`);
    return res.data;
}

export async function updateUser(userId: number, userData: UpdateUserModel) {
    const response = await api.patch(`/user/${userId}`, userData);
    return response.data;
}

export async function deleteUser(userId: number) {
    const response = await api.delete(`/user/${userId}`);
    return response.data;
}

export async function UpdateMultipleUser(user_ids: number[], userData: UpdateMultiUserModel) {
    const response = await api.post('/user/update-multiple', {
        user_ids,
        data: userData
    });
    return response.data;
}

export async function deleteMultipleUser(user_ids: number[]) {
    const response = await api.post('/user/delete-multiple', { user_ids });
    return response.data;
}
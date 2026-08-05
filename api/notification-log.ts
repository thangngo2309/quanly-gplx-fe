import { FilterNotificationLog } from "@/model/notification-log.model";
import api from "./axios.config";

export async function getAllNotificationLog(filters?: FilterNotificationLog, page?: number, limit?: number) {
    const res = await api.post('/notification-log/find-all',
        { ...filters, },
        { params: { page, limit } }
    );
    return res.data;
}

export async function retryNotificationLog(driver_license_id: number) {
    const response = await api.post(`/notification-log/retry-notification/${driver_license_id}`);
    return response.data;
}
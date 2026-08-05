import { MetaPaging } from "./meta-paging.model";
import { UserDataModel } from "./user.model";

export interface NotificationLogDataModel {
    notification_log_id: number;
    reference_type: string;
    reference_id: number;
    notification_type: string;
    user: UserDataModel;
    user_id: number;
    recipient: string;
    send_status: string;
    error_message: string;
    retry_count: number;
    sent_at: Date;
    created_at: Date;
    expiry_date: Date;
    can_retry: boolean;
}

export interface NotificationLogModel {
    data: NotificationLogDataModel[];
    meta: MetaPaging;
}

export interface FilterNotificationLog {
    reference_type?: string;
    notification_type?: string;
    send_status?: string;
    recipient?: string;
    fullname?: string;
}

export interface RetryNotificationLogModel {
    notification_type: string;
}

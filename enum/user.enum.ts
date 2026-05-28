export enum UserRole {
    ADMIN = 'admin',
    TEACHER = 'teacher',
    USER = 'user',
}

export enum TeachingSubject {
    LYTHUYET = 'Lý thuyết',
    THUCHANH = 'Thực hành',
    KET_HOP = 'Lý thuyết và thực hành'
}

export enum RecruitmentType {
    BIENCHE = 'bienche',
    HOPDONG = 'hopdong',
}

export const RecruitmentTypeLabel: Record<RecruitmentType, string> = {
    [RecruitmentType.BIENCHE]: 'Biên chế',
    [RecruitmentType.HOPDONG]: 'Hợp đồng',
};
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

export enum UserPedagogyLevel {
    SPDAYNGHE = 'Sư phạm dạy nghề',
    SPBAC1 = 'Sư phạm bậc 1',
    SPBAC2 = 'Sư phạm bậc 2',
    SPSOCAP = 'Sư phạm dạy trình độ sơ cấp',
    SPCAODANG = 'Sư phạm dạy trình độ cao đẳng',
    SPTRUNGCAP = 'Sư phạm dạy trình độ trung cấp'
}
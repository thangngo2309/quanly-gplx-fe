import { RecruitmentType, TeachingSubject, UserRole, UserPedagogyLevel} from '@/enum/user.enum';
import { MetaPaging } from './meta-paging.model';

export interface CreateUserModel {
  username: string;
  password: string;
  confirmPassword?: string;
  fullname: string;
  date_of_birth: string;
  citizen_id: string;
  address: string;
  role: UserRole;
  recruitment_type?: RecruitmentType | null;
  education_level?: string;
  professional_level?: string;
  pedagogy_level?: UserPedagogyLevel | null;
  teaching_subject?: TeachingSubject | null;
  teacher_certificate_number?: string;
  teacher_certificate_issue_date?: Date;
  teacher_certificate_issue_place?: string;
  health_certificate_number?: string;
  health_certificate_expiry_date?: Date;
  contract_number?: string;
  contract_signed_date?: Date;
  contract_expiry_date?: Date;
}

export interface UserDataModel {
  user_id: number;
  username: string;
  fullname: string;
  date_of_birth: string;
  citizen_id: string;
  address: string;
  role: UserRole;
  recruitment_type: RecruitmentType;
  education_level: string;
  professional_level: string;
  pedagogy_level: UserPedagogyLevel;
  teaching_subject: TeachingSubject;
  teacher_certificate_number: string;
  teacher_certificate_issue_date: Date;
  teacher_certificate_issue_place: string;
  health_certificate_number: string;
  health_certificate_expiry_date: Date;
  contract_number: string;
  contract_signed_date: Date;
  contract_expiry_date: Date;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface UserModel {
    data: UserDataModel[];
    meta: MetaPaging;
}

export interface UpdateMultiUserModel {
    fullname?: string;
    is_active?: boolean;
    address?: string;
    recruitment_type?: RecruitmentType | null;
    education_level?: string;
    professional_level?: string;
    pedagogy_level?: UserPedagogyLevel | null;
    teaching_subject?: TeachingSubject | null;
    teacher_certificate_issue_date?: Date;
    teacher_certificate_issue_place?: string;
    health_certificate_expiry_date?: Date;
    contract_signed_date?: Date;
    contract_expiry_date?: Date;
}

export interface UpdateUserModel {
  user_id?: number;
  fullname?: string;
  date_of_birth?: string;
  citizen_id?: string;
  address?: string;
  recruitment_type?: RecruitmentType | null;
  education_level?: string;
  professional_level?: string;
  pedagogy_level?: UserPedagogyLevel | null;
  teaching_subject?: TeachingSubject | null;
  teacher_certificate_number?: string;
  teacher_certificate_issue_date?: Date;
  teacher_certificate_issue_place?: string;
  health_certificate_number?: string;
  health_certificate_expiry_date?: Date;
  contract_number?: string;
  contract_signed_date?: Date;
  contract_expiry_date?: Date;
}

export type FilterUserForm = {
  name: string;
  cccd: string;
  active: boolean | undefined;
  sortBy: string | 'user_id';
  sortDirection: 'ASC' | 'DESC';
};
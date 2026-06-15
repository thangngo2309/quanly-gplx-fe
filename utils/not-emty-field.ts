import { UpdateMultiCarModel } from "@/model/car.model";
import { UpdateMultiUserModel, UpdateUserModel } from "@/model/user.model";

export const USER_NOT_EMPTY_FIELDS: (keyof UpdateMultiUserModel)[] = ['fullname', 'address', 'education_level', 'professional_level', 'teacher_certificate_issue_place'];

export const CAR_NOT_EMPTY_FIELDS: (keyof UpdateMultiCarModel)[] = ['brand', 'manufacturingYear', 'owner'];

export const USER_CAN_NULLABLE_FIELDS: (keyof UpdateUserModel)[] = [
  'education_level',
  'professional_level',
  'teacher_certificate_number',
  'teacher_certificate_issue_place',
  'health_certificate_number',
  'contract_number',
];
import { UpdateMultiCarModel } from "@/model/car.model";
import { UpdateMultiUserModel } from "@/model/user.model";

export const USER_NOT_EMPTY_FIELDS: (keyof UpdateMultiUserModel)[] = ['fullname', 'address', 'education_level', 'professional_level', 'teacher_certificate_issue_place'];

export const CAR_NOT_EMPTY_FIELDS: (keyof UpdateMultiCarModel)[] = ['brand', 'manufacturingYear', 'owner'];
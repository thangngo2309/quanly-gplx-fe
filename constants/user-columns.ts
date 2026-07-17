import { GridColDef } from '@mui/x-data-grid';
import {formatDateTime, toUTC7} from '@/utils/format-date';
import { RecruitmentType, RecruitmentTypeLabel } from '@/enum/user.enum';

export const USER_COLUMNS: GridColDef[] = [
  {
    field: 'user_id',
    headerName: 'ID',
    width: 80,
  },
  {
    field: 'fullname',
    headerName: 'Họ và tên',
    minWidth: 150,
    flex: 1,
  },
  {
    field: 'date_of_birth',
    headerName: 'Ngày sinh',
    width: 140,
    renderCell: (params) => formatDateTime(params.value),
  },
  {
    field: 'citizen_id',
    headerName: 'CCCD',
    width: 170,
  },
  {
    field: 'address',
    headerName: 'Địa chỉ',
    minWidth: 120,
    flex: 1,
  },
  {
    field: 'phone_number',
    headerName: 'Số điện thoại',
    width: 150,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 200,
  },
  {
    field: 'role',
    headerName: 'Vai trò',
    width: 140,
  },
  {
    field: 'recruitment_type',
    headerName: 'Loại tuyển dụng',
    width: 180,
    valueFormatter: (value: RecruitmentType) => RecruitmentTypeLabel[value] ?? value,
  },
  {
    field: 'education_level',
    headerName: 'Trình độ học vấn',
    width: 180,
  },
  {
    field: 'professional_level',
    headerName: 'Trình độ chuyên môn',
    width: 200,
  },
  {
    field: 'pedagogy_level',
    headerName: 'Trình độ sư phạm',
    width: 180,
  },
  {
    field: 'teaching_subject',
    headerName: 'Môn giảng dạy',
    width: 180,
  },
  {
    field: 'teacher_certificate_number',
    headerName: 'Số chứng nhận giáo viên',
    width: 200,
  },
  {
    field: 'teacher_certificate_issue_date',
    headerName: 'Ngày cấp chứng nhận giáo viên',
    width: 170,
    renderCell: (params) => formatDateTime(params.value),
  },
  {
    field: 'teacher_certificate_issue_place',
    headerName: 'Nơi cấp chứng nhận giáo viên',
    width: 200,
  },
  {
    field: 'health_certificate_number',
    headerName: 'Số giấy khám sức khỏe',
    width: 220,
  },
  {
    field: 'health_certificate_expiry_date',
    headerName: 'Ngày hết hạn giấy khám sức khỏe',
    width: 180,
    renderCell: (params) => formatDateTime(params.value),
  },
  {
    field: 'contract_number',
    headerName: 'Số hợp đồng',
    width: 170,
  },
  {
    field: 'contract_signed_date',
    headerName: 'Ngày ký HĐ',
    width: 160,
    renderCell: (params) => formatDateTime(params.value),
  },
  {
    field: 'contract_expiry_date',
    headerName: 'Ngày hết hạn HĐ',
    width: 180,
    renderCell: (params) => formatDateTime(params.value),
  },
  {
    field: 'is_active',
    headerName: 'Trạng thái Hoạt động',
    width: 120,
    type: 'boolean',
  },
  {
    field: 'test_date_time',
    headerName: 'Ngày giờ kiểm tra',
    width: 180,
    renderCell: (params) => toUTC7(params.value),
  }
];
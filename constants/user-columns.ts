import { GridColDef } from '@mui/x-data-grid';
import {formatDateTime} from '@/lib/format-date';

export const USER_COLUMNS: GridColDef[] = [
  {
    field: 'user_id',
    headerName: 'ID',
    width: 80,
  },
  {
    field: 'fullname',
    headerName: 'Họ và tên',
    width: 220,
    editable: true,
  },
  {
    field: 'date_of_birth',
    headerName: 'Ngày sinh',
    width: 140,
    editable: true,
    renderCell: (params) => formatDateTime(params.value),
  },
  {
    field: 'citizen_id',
    headerName: 'CCCD',
    width: 170,
    editable: true,
  },
  {
    field: 'address',
    headerName: 'Địa chỉ',
    width: 250,
    editable: true,
  },
  {
    field: 'role',
    headerName: 'Vai trò',
    width: 140,
  },
  {
    field: 'recuitment_type',
    headerName: 'Loại tuyển dụng',
    width: 180,
    editable: true,
  },
  {
    field: 'education_level',
    headerName: 'Trình độ học vấn',
    width: 180,
    editable: true,
  },
  {
    field: 'professional_level',
    headerName: 'Trình độ chuyên môn',
    width: 200,
    editable: true,
  },
  {
    field: 'pedagogy_level',
    headerName: 'Trình độ sư phạm',
    width: 180,
    editable: true,
  },
  {
    field: 'teaching_subject',
    headerName: 'Môn giảng dạy',
    width: 180,
    editable: true,
  },
  {
    field: 'teacher_certificate_number',
    headerName: 'Số chứng chỉ GV',
    width: 200,
    editable: true,
  },
  {
    field: 'teacher_certificate_issue_date',
    headerName: 'Ngày cấp CC GV',
    width: 170,
    editable: true,
    renderCell: (params) => formatDateTime(params.value),
  },
  {
    field: 'teacher_certificate_issue_place',
    headerName: 'Nơi cấp CC GV',
    width: 200,
    editable: true,
  },
  {
    field: 'health_certificate_number',
    headerName: 'Số giấy khám sức khỏe',
    width: 220,
    editable: true,
  },
  {
    field: 'health_certificate_expiry_date',
    headerName: 'Hạn giấy khám SK',
    width: 180,
    editable: true,
    renderCell: (params) => formatDateTime(params.value),
  },
  {
    field: 'contract_number',
    headerName: 'Số hợp đồng',
    width: 170,
    editable: true,
  },
  {
    field: 'contract_signed_date',
    headerName: 'Ngày ký HĐ',
    width: 160,
    editable: true,
    renderCell: (params) => formatDateTime(params.value),
  },
  {
    field: 'contract_expiry_date',
    headerName: 'Ngày hết hạn HĐ',
    width: 180,
    editable: true,
    renderCell: (params) => formatDateTime(params.value),
  },
  {
    field: 'is_active',
    headerName: 'Trạng thái Hoạt động',
    width: 120,
    type: 'boolean',
    editable: true,
  },
];
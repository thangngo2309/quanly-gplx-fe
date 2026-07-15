import { GridColDef } from '@mui/x-data-grid';
import {formatDateTime, toUTC7} from '@/utils/format-date';

export const CAR_COLUMNS: GridColDef[] = [
  {
    field: 'car_id',
    headerName: 'ID',
    width: 80,
  },
  {
    field: 'registrationNumber',
    headerName: 'Biển số xe',
    width: 150,
  },
  {
    field: 'chassis_number',
    headerName: 'Số khung',
    width: 150,
  },
  {
    field: 'engine_number',
    headerName: 'Số máy',
    width: 150,
  },
  {
    field: 'vehicle_type',
    headerName: 'Loại xe',
    width: 120,
  },
  {
    field: 'brand',
    headerName: 'Thương hiệu',
    width: 120,
  },
  {
    field: 'category',
    headerName: 'Hạng xe',
    width: 120,
  },
  {
    field: 'manufacturingYear',
    headerName: 'Năm sản xuất',
    width: 120,
  },
  {
    field: 'owner',
    headerName: 'Chủ sở hữu/hợp đồng',
    width: 170,
  },
  {
    field: 'hasDualBrake',
    headerName: 'Phanh phụ',
    width: 120,
    type: 'boolean',
  },
  {
    field: 'practiceVehicleLicenseNumber',
    headerName: 'Số GP xe tập lái',
    width: 200,
  },
  {
    field: 'practiceVehicleLicenseIssueDate',
    headerName: 'Ngày cấp GP xe tập lái',
    width: 180,
    renderCell: (params) => formatDateTime(params.value),
  },
  {
    field: 'practiceVehicleLicenseExpiryDate',
    headerName: 'Ngày hết hạn GP xe tập lái',
    width: 180,
    renderCell: (params) => formatDateTime(params.value),
  },
  {
    field: 'vehicle_inspection.inspection_issue_date',
    headerName: 'Ngày cấp đăng kiểm',
    width: 200,
    valueGetter: (value, row) => {
      const inspection_issue_date = row.vehicle_inspection?.[0]?.inspection_issue_date;
      return inspection_issue_date ? formatDateTime(inspection_issue_date) : '';
    },
  },
  {
    field: 'vehicle_inspection.inspection_expiry_date',
    headerName: 'Ngày hết hạn đăng kiểm',
    width: 180,
    valueGetter: (value, row) => {
      const inspection_expiry_date = row.vehicle_inspection?.[0]?.inspection_expiry_date;
      return inspection_expiry_date ? formatDateTime(inspection_expiry_date) : '';
    }
  },
  {
    field: 'insuranceExpiryDate',
    headerName: 'Ngày hết hạn bảo hiểm',
    width: 180,
    renderCell: (params) => formatDateTime(params.value),
  },
  {
    field: 'imeiDat',
    headerName: 'Số imei DAT',
    width: 180,
  },
  {
    field: 'serialNumber',
    headerName: 'Số seri',
    width: 200,
  },
  {
    field: 'isActive',
    headerName: 'Trạng thái Hoạt động',
    width: 120,
    type: 'boolean',
  },
  {
    field: 'createdAt',
    headerName: 'Ngày tạo',
    minWidth: 160,
    flex: 1,
    renderCell: (params) => toUTC7(params.value),
  },
  {
    field: 'updatedAt',
    headerName: 'Ngày cập nhật',
    minWidth: 160,
    flex: 1,
    renderCell: (params) => toUTC7(params.value),
  },
];
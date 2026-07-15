import { GridColDef } from '@mui/x-data-grid';
import { formatDateTime } from '@/utils/format-date';

export const VEHICLE_INSPECTION_COLUMNS: GridColDef[] = [
    {
        field: 'car.registrationNumber',
        headerName: 'Biển số xe',
        width: 150,
        valueGetter: (value, row) => row.car?.registrationNumber || '',
    },
    {
        field: 'car.vehicle_type',
        headerName: 'Loại xe',
        width: 120,
        valueGetter: (value, row) => row.car?.vehicle_type || '',
    },
    {
        field: 'car.brand',
        headerName: 'Thương hiệu',
        width: 120,
        valueGetter: (value, row) => row.car?.brand || '',
    },
    {
        field: 'car.chassis_number',
        headerName: 'Số khung',
        width: 150,
        valueGetter: (value, row) => row.car?.chassis_number || '',
    },
    {
        field: 'car.engine_number',
        headerName: 'Số máy',
        width: 150,
        valueGetter: (value, row) => row.car?.engine_number || '',
    },
    {
        field: 'car.manufacturingYear',
        headerName: 'Năm sản xuất',
        width: 120,
        valueGetter: (value, row) => row.car?.manufacturingYear || '',
    },
    {
        field: 'inspection_issue_date',
        headerName: 'Ngày cấp đăng kiểm',
        width: 170,
        renderCell: (params) => formatDateTime(params.value),
    },
    {
        field: 'inspection_expiry_date',
        headerName: 'Ngày hết hạn đăng kiểm',
        width: 170,
        renderCell: (params) => formatDateTime(params.value),
    },
    {
        field: 'is_active',
        headerName: 'Trạng thái hoạt động',
        width: 150,
        type: 'boolean',
        flex: 1,
    }
]

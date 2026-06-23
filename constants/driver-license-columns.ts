import { GridColDef } from '@mui/x-data-grid';
import { formatDateTime } from '@/utils/format-date';

export const DRIVER_LICENSE_COLUMNS: GridColDef[] = [
    {
        field: 'user_fullname',
        headerName: 'Họ và tên',
        width: 150,
        valueGetter: (value, row) => row.user?.fullname || '',
        flex: 1,
    },
    {
        field: 'user_date_of_birth',
        headerName: 'Ngày sinh',
        width: 150,
        valueGetter: (value, row) => {
            const date_of_birth = row.user?.date_of_birth;
            return date_of_birth ? formatDateTime(date_of_birth) : '';
        },
    },
    {
        field: 'license_number',
        headerName: 'Số Giấy phép lái xe',
        width: 150,
    },
    {
        field: 'issue_date',
        headerName: 'Ngày cấp',
        width: 150,
        renderCell: (params) => formatDateTime(params.value),
    },
    {
        field: 'expiry_date',
        headerName: 'Ngày hết hạn',
        width: 150,
        renderCell: (params) => formatDateTime(params.value),
    },
    {
        field: 'pass_date',
        headerName: 'Ngày trúng tuyển',
        width: 150,
        renderCell: (params) => formatDateTime(params.value),
    },
    {
        field: 'issue_place',
        headerName: 'Nơi cấp',
        width: 150,
    },
    {
        field: 'is_active',
        headerName: 'Trạng thái hoạt động',
        width: 120,
        type: 'boolean',
    }
]
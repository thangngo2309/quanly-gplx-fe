import { CarDataModel } from "@/model/car.model";
import { VehicleInspectionDataModel } from "@/model/vehicle-inspection.model";
import { formatDateTime } from "@/utils/format-date";
import { Chip, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Stack } from "@mui/system";

interface ViewVehicleInspectionHistoryDialogProps {
    open: boolean;
    onClose: () => void;
    data: VehicleInspectionDataModel[];
    selectedCar: CarDataModel | null;
}

export const ViewVehicleInspectionHistoryDialog = ({ open, onClose, data, selectedCar }: ViewVehicleInspectionHistoryDialogProps) => {
    const columns: GridColDef[] = [
        {
            field: 'inspection_issue_date',
            headerName: 'Ngày cấp',
            width: 160,
            renderCell: (params) => formatDateTime(params.value),
        },
        {
            field: 'inspection_expiry_date',
            headerName: 'Ngày hết hạn',
            width: 160,
            renderCell: (params) => formatDateTime(params.value),
        },
        {
            field: 'is_active',
            headerName: 'Trạng thái',
            width: 200,
            type: 'boolean',
            align: 'left',
            headerAlign: 'left',
            renderCell: ({ value }) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    {value ? (
                        <CheckIcon color="success" fontSize="small" />
                    ) : (
                        <CloseIcon color="error" fontSize="small" />
                    )}

                    <Typography
                        variant="body2"
                        color={value ? 'success.main' : 'error.main'}
                    >
                        {value ? 'Còn hiệu lực' : 'Hết hạn'}
                    </Typography>
                </Stack>
            ),
        },
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Lịch sử đăng kiểm - Xe: {selectedCar?.registrationNumber}</DialogTitle>
            <DialogContent>
                <DataGrid
                    rows={data}
                    columns={columns}
                    getRowId={(row) => row.vehicle_inspection_id}
                    hideFooter
                    disableRowSelectionOnClick
                    checkboxSelection={false}
                />
            </DialogContent>
        </Dialog>
    );
};
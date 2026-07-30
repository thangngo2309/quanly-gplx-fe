
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { IconButton, Tooltip } from '@mui/material';

interface ViewVehicleInspectionHistoryButtonProps {
    carId: number;
    onGet: (carId: number) => void;
}

export const ViewVehicleInspectionHistoryButton = ({ carId, onGet }: ViewVehicleInspectionHistoryButtonProps) => {
    return (
        <Tooltip title="Xem lịch sử đăng kiểm">
            <IconButton
                color="info"
                onClick={() => onGet(carId)}
            >
                <HistoryEduIcon />
            </IconButton>
        </Tooltip>
    );
};

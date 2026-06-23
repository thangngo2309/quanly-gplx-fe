import { DriverLicenseDataModel } from '@/model/driver-license.model';
import UpdateIcon from '@mui/icons-material/Update';
import { IconButton, Tooltip } from '@mui/material';

interface RenewDrivingLicenseProps {
    driver_license: DriverLicenseDataModel;
    onRenew: (driver_license: DriverLicenseDataModel) => void;
}

export const RenewDrivingLicenseButton = ({ driver_license, onRenew }: RenewDrivingLicenseProps) => {
    return (
        <Tooltip title="Gia hạn giấy phép lái xe">
            <IconButton
                color="primary"
                onClick={() => onRenew(driver_license)}
            >
                <UpdateIcon />
            </IconButton>
        </Tooltip>
    );
};

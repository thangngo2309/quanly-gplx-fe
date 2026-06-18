import { IconButton, Tooltip } from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import { UserDataModel } from "@/model/user.model";

interface ResetPasswordButtonProps {
    user: UserDataModel;
    onResetPassword: (user: UserDataModel) => void;
}

export const ResetPasswordButton = ({ user, onResetPassword }: ResetPasswordButtonProps) => {
    return (
        <Tooltip title="Đặt lại mật khẩu">
            <IconButton
                color="warning"
                onClick={() => onResetPassword(user)}
            >
                <LockResetIcon />
            </IconButton>
        </Tooltip>
    );
};

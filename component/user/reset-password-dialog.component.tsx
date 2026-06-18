'use client';

import Button from '@mui/material/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import { InfoRow, Label, Value } from '@/style object/profile.style';

type Props = {
    open: boolean;
    newPassword: string;
    onClose: () => void;
};

export const ResetPasswordDialog = ({ open, newPassword, onClose }: Props) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(newPassword);
        setCopied(true);
    };

    const handleClose = () => {
        setCopied(false);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Mật khẩu mới</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    Sao chép và gửi mật khẩu này cho người dùng.
                </Typography>
                <InfoRow>
                    <Label>Mật khẩu</Label>
                    <Value>{newPassword}</Value>
                </InfoRow>
            </DialogContent>
            <DialogActions>
                <Tooltip title="Đã sao chép!" open={copied} disableFocusListener disableHoverListener disableTouchListener>
                    <Button variant="contained" size="small" onClick={handleCopy} disabled={copied}>
                        Sao chép
                    </Button>
                </Tooltip>
                <Button onClick={handleClose}>Đóng</Button>
            </DialogActions>
        </Dialog>
    );
};
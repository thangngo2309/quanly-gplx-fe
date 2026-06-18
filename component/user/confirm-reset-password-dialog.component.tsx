'use client'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { UserDataModel } from '@/model/user.model';

interface ConfirmResetPasswordDialogProps {
  open: boolean;
  user: UserDataModel | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmResetPasswordDialog = ({
  open,
  user,
  onClose,
  onConfirm,
}: ConfirmResetPasswordDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận đặt lại mật khẩu</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản của{' '}
          <strong>{user?.fullname}</strong>? Mật khẩu cũ sẽ không thể sử dụng được nữa.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Hủy bỏ</Button>
        <Button onClick={onConfirm} color="warning" variant="contained" autoFocus>
          Đặt lại
        </Button>
      </DialogActions>
    </Dialog>
  );
};
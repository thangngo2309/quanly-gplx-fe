import { ChangePasswordDialogProps } from "@/model/user-dialog-props";
import { ChangePasswordForm } from "@/model/user.model";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, IconButton, InputAdornment, TextField } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form } from "../form.component";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const ChangePasswordDialog = memo(
    ({ open, onClose, onSave }: ChangePasswordDialogProps) => {
        const [showOldPassword, setShowOldPassword] = useState(false);
        const [showNewPassword, setShowNewPassword] = useState(false);
        const [showConfirmPassword, setShowConfirmPassword] = useState(false);
        const methods = useForm<ChangePasswordForm>({
            mode: 'all',
            reValidateMode: 'onChange',
        });
        const { watch, control, reset, formState: { errors }, trigger } = methods;
        useEffect(() => { if (open) { reset(); } }, [open]);

        const onSubmit = (data: ChangePasswordForm) => {
            onSave(data);
        }
        return (
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                scroll="paper"
            >
                <DialogTitle>Đổi mật khẩu</DialogTitle>
                <Form<ChangePasswordForm>
                    onSubmit={onSubmit}
                    methods={methods}
                >
                    <DialogContent>
                        <FormControl fullWidth margin="dense">
                            <FormLabel required>Mật khẩu hiện tại</FormLabel>
                            <Controller
                                name="old_password"
                                control={control}
                                rules={{
                                    required: 'Vui lòng nhập mật khẩu hiện tại'
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            if (
                                                watch('new_password')?.length > 0
                                            ) {
                                                trigger('new_password');
                                            }
                                        }}
                                        value={field.value ?? ''}
                                        type={showOldPassword ? 'text' : 'password'}
                                        fullWidth
                                        placeholder="********"
                                        variant="outlined"
                                        error={!!errors.old_password}
                                        helperText={errors.old_password?.message}
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowOldPassword(!showOldPassword)}>
                                                            {showOldPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }
                                        }}
                                    />
                                )}
                            />
                        </FormControl>

                        <FormControl fullWidth margin="dense">
                            <FormLabel required>Mật khẩu mới</FormLabel>
                            <Controller
                                name="new_password"
                                control={control}
                                rules={{
                                    required: 'Vui lòng nhập mật khẩu mới',
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{}|;':",.\/<>?]).{8,}$/,
                                        message: 'Mật khẩu phải chứa ít nhất 8 kí tự, bao gồm 1 chữ hoa, 1 chữ thường, 1 số, 1 kí tự đặc biệt và không chứa khoảng trắng'
                                    },
                                    validate: (value) =>
                                        value !== watch('old_password') ||
                                        'Mật khẩu mới không được trùng mật khẩu hiện tại',
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            if (
                                                watch('confirm_new_password')?.length > 0
                                            ) {
                                                trigger('confirm_new_password');
                                            }
                                        }}
                                        value={field.value ?? ''}
                                        type={showNewPassword ? 'text' : 'password'}
                                        fullWidth
                                        placeholder="********"
                                        variant="outlined"
                                        error={!!errors.new_password}
                                        helperText={errors.new_password?.message}
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                                                            {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }
                                        }}
                                    />
                                )}
                            />
                        </FormControl>

                        <FormControl fullWidth margin="dense">
                            <FormLabel required>Xác nhận mật khẩu</FormLabel>
                            <Controller
                                name="confirm_new_password"
                                control={control}
                                rules={{
                                    required: 'Vui lòng xác nhận mật khẩu mới',
                                    validate: (value) =>
                                        value === watch('new_password') ||
                                        'Mật khẩu xác nhận không khớp',
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        value={field.value ?? ''}
                                        type={showConfirmPassword ? "text" : "password"}
                                        fullWidth
                                        placeholder="********"
                                        variant="outlined"
                                        error={!!errors.confirm_new_password}
                                        helperText={errors.confirm_new_password?.message}
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }
                                        }}
                                    />
                                )}
                            />
                        </FormControl>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={onClose}>
                            Hủy
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                        >
                            Lưu
                        </Button>
                    </DialogActions>
                </Form>
            </Dialog>
        );
    }
)

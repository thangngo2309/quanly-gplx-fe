import { RenewDriverLicenseDialogProps } from "@/model/driver-license-dialog-props";
import { UpdateDriverLicenseModel } from "@/model/driver-license.model";
import { memo, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form } from "@/component/form.component";
import { DatePickerField } from "../date-picker.component";
import dayjs from "dayjs";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

export const RenewDriverLicenseDialog = memo(({ open, onClose, onSave, data }: RenewDriverLicenseDialogProps) => {
    const methods = useForm<UpdateDriverLicenseModel>({
        mode: 'all',
        reValidateMode: 'onChange',
    });

    const errors = methods.formState.errors;

    useEffect(() => {
        if (open && data) {
            methods.reset(data);
        }
    }, [open, data]);

    const onSubmit: SubmitHandler<UpdateDriverLicenseModel> = (data) => {
        onSave(data);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
            <DialogTitle>Gia hạn giấy phép lái xe</DialogTitle>

            {open && (
                <Form<UpdateDriverLicenseModel> methods={methods} onSubmit={onSubmit}>
                    <DialogContent>
                        <DatePickerField
                            name="issue_date"
                            control={methods.control}
                            label="Ngày cấp"
                            required
                            error={!!errors.issue_date}
                            helperText={errors.issue_date?.message}
                            rules={{
                                required: 'Vui lòng chọn ngày cấp',
                                validate: (value: Date) => {
                                    const passDate = methods.getValues('pass_date');
                                    if (!value || !passDate) return true;
                                    return (
                                        dayjs(passDate).isBefore(value, 'day') ||
                                        dayjs(passDate).isSame(value, 'day') ||
                                        'Ngày cấp phải lớn hơn hoặc bằng ngày trúng tuyển'
                                    );
                                },
                            }}
                            triggerOnBlur="pass_date"
                        />

                        <DatePickerField
                            name="expiry_date"
                            control={methods.control}
                            label="Ngày hết hạn"
                            error={!!errors.expiry_date}
                            helperText={errors.expiry_date?.message}
                            rules={{
                                validate: (value: Date) => {
                                    const issueDate = methods.getValues('issue_date');
                                    if (!value || !issueDate) return true;
                                    return (
                                        dayjs(value).startOf('day').isAfter(dayjs(issueDate).startOf('day')) ||
                                        'Ngày hết hạn phải sau ngày cấp'
                                    );
                                },
                            }}
                            triggerOnBlur="issue_date"
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={onClose}>Hủy</Button>
                        <Button type="submit" variant="contained">Lưu</Button>
                    </DialogActions>
                </Form>
            )}
        </Dialog>
    );
});
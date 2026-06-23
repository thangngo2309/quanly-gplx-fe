'use client';

import {
    Button, Dialog, DialogActions, DialogContent,
    DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Switch, TextField,
} from '@mui/material';
import { memo, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { EditMultiDriverLicenseDialogProps } from '@/model/driver-license-dialog-props';
import { Form } from '@/component/form.component';
import { DatePickerField } from '../date-picker.component';
import { UpdateMultiDriverLicenseModel } from '@/model/driver-license.model';

export const EditMultiDriverLicenseDialog = memo(({ open, selectedIds, onClose, onSave }: EditMultiDriverLicenseDialogProps) => {
    const methods = useForm<UpdateMultiDriverLicenseModel>({
        mode: 'all',
        reValidateMode: 'onChange',
    });

    const errors = methods.formState.errors;

    useEffect(() => {
        if (open) { methods.reset(); }
    }, [open]);

    const onSubmit: SubmitHandler<UpdateMultiDriverLicenseModel> = async (data) => {
        onSave(selectedIds, {
            ...data,
            is_active: data.is_active ? data.is_active?.toString() === 'true' : undefined,
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
            <DialogTitle>Cập nhật nhiều giấy phép lái xe</DialogTitle>
            {open && (
                <Form<UpdateMultiDriverLicenseModel> methods={methods} onSubmit={onSubmit}>
                    <DialogContent>
                        <DatePickerField
                            name="pass_date"
                            control={methods.control}
                            label="Ngày trúng tuyển"
                            error={!!errors.pass_date}
                            helperText={errors.pass_date?.message}
                            rules={{
                                validate: (value: Date) => {
                                    const issueDate = methods.getValues('issue_date');
                                    if (!value || !issueDate) return true;
                                    return (
                                        dayjs(value).isBefore(issueDate, 'day') ||
                                        dayjs(value).isSame(issueDate, 'day') ||
                                        'Ngày trúng tuyển phải nhỏ hơn hoặc bằng ngày cấp'
                                    );
                                },
                            }}
                            triggerOnBlur="issue_date"
                        />

                        <DatePickerField
                            name="issue_date"
                            control={methods.control}
                            label="Ngày cấp"
                            error={!!errors.issue_date}
                            helperText={errors.issue_date?.message}
                            rules={{
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

                        <FormControl fullWidth margin="dense">
                            <FormLabel>Nơi cấp</FormLabel>
                            <Controller
                                name="issue_place"
                                control={methods.control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        value={field.value ?? ''}
                                        placeholder="VD: Sở GTVT TP.HCM"
                                        error={!!errors.issue_place}
                                        helperText={errors.issue_place?.message}
                                    />
                                )}
                            />
                        </FormControl>

                        <FormControl fullWidth margin="dense">
                            <FormLabel>Trạng thái hoạt động</FormLabel>
                            <Controller
                                name="is_active"
                                control={methods.control}
                                render={({ field }) => (
                                    <RadioGroup
                                        {...field}
                                        row
                                        value={field.value ?? ''}
                                    >
                                        <FormControlLabel value="true" control={<Radio />} label="Hoạt động" />
                                        <FormControlLabel value="false" control={<Radio />} label="Không hoạt động" />
                                    </RadioGroup>
                                )}
                            />
                        </FormControl>
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
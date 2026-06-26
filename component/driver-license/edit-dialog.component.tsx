'use client';

import {
    Autocomplete, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, FormControl, FormLabel, MenuItem, Switch, TextField, FormControlLabel,
    RadioGroup,
    Radio,
} from '@mui/material';
import { memo, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { EditDriverLicenseDialogProps } from '@/model/driver-license-dialog-props';
import { Form } from '@/component/form.component';
import { DatePickerField } from '../date-picker.component';
import { UpdateDriverLicenseModel } from '@/model/driver-license.model';
import { autoTrimUppercaseRemoveSpecialChars } from '@/utils/format-input';
import { debounceUniqueLicenseNumber } from '@/utils/debounced-driver-license';

export const EditDialog = memo(({ open, users, onClose, onSave, data }: EditDriverLicenseDialogProps) => {
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

    const onSubmit: SubmitHandler<UpdateDriverLicenseModel> = (formData) => {
        onSave({
            ...formData,
            is_active: formData.is_active ? formData.is_active?.toString() === 'true' : undefined,
        });
    };

    const checkLicenseNumber = async (value: string | undefined) => {
        if (!value) return true;
        const isUnique = await debounceUniqueLicenseNumber(value, Number(data?.driver_license_id));
        return isUnique || 'Số GPLX đã tồn tại';
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
            <DialogTitle>Cập nhật giấy phép lái xe</DialogTitle>

            {open && (
                <Form<UpdateDriverLicenseModel> methods={methods} onSubmit={onSubmit}>
                    <DialogContent>
                        <FormControl fullWidth margin="dense">
                            <FormLabel required>Chọn người dùng</FormLabel>
                            <Controller
                                name="user_id"
                                control={methods.control}
                                rules={{ required: 'Vui lòng chọn người dùng' }}
                                render={({ field }) => (
                                    <Autocomplete
                                        options={users}
                                        getOptionLabel={(option) => `${option.fullname} - ${option.citizen_id}`}
                                        value={users.find((u) => u.user_id === field.value) || null}
                                        onChange={(_, value) => field.onChange(value?.user_id ?? null)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                error={!!errors.user_id}
                                                helperText={errors.user_id?.message}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </FormControl>

                        <FormControl fullWidth margin="dense">
                            <FormLabel required>Số GPLX</FormLabel>
                            <Controller
                                name="license_number"
                                control={methods.control}
                                rules={{
                                    required: 'Vui lòng nhập số GPLX',
                                    pattern: {
                                        value: /^[A-Z0-9]+$/,
                                        message: 'GPLX chỉ chấp nhận chữ in hoa và số',
                                    },
                                    validate: checkLicenseNumber,
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        value={field.value ?? ''}
                                        onChange={(e) => field.onChange(autoTrimUppercaseRemoveSpecialChars(e.target.value))}
                                        placeholder="VD: FC123456789"
                                        error={!!errors.license_number}
                                        helperText={errors.license_number?.message}
                                    />
                                )}
                            />
                        </FormControl>

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

                        <FormControl fullWidth margin="dense">
                            <FormLabel required>Nơi cấp</FormLabel>
                            <Controller
                                name="issue_place"
                                control={methods.control}
                                rules={{ required: 'Vui lòng nhập nơi cấp' }}
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
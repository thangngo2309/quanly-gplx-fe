'use client';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    FormControl,
    TextField,
    DialogActions,
    Button,
    FormLabel,
    FormControlLabel,
    RadioGroup,
    Radio,
    MenuItem,
    Typography,
} from "@mui/material";

import { memo, useEffect } from "react";
import { Form } from "@/component/form.component";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { EditCarDialogProps } from "@/model/car-dialog-props";
import { UpdateCarModel } from "@/model/car.model";
import { autoTrim, autoTrimUppercaseRemoveSpecialChars } from "@/utils/format-input";
import { CarCategory } from "@/enum/car.enum";
import dayjs from "dayjs";
import { DatePickerField } from "../date-picker.component";

export const EditDialog = memo(
    ({ open, onClose, onSave, data }: EditCarDialogProps) => {

        const methods = useForm<UpdateCarModel>({
            mode: 'onChange',
            reValidateMode: 'onChange',
        });

        const errors = methods.formState.errors;

        useEffect(() => {
            if (open && data) {
                methods.reset(data);
            }
        }, [open, data]);

        const onSubmit: SubmitHandler<UpdateCarModel> = async (formData) => {
            const dirtyFields = methods.formState.dirtyFields;

            const payload = Object.keys(dirtyFields).reduce((acc, key) => {
                (acc as any)[key] = formData[key as keyof UpdateCarModel];
                return acc;
            }, {} as Partial<UpdateCarModel>);
            onSave(payload);
        };

        return (
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                scroll="paper"
            >
                <DialogTitle>Cập nhật xe tập lái</DialogTitle>

                {open && (
                    <Form<UpdateCarModel>
                        onSubmit={onSubmit}
                        methods={methods}
                    >
                        <DialogContent>

                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Biển số xe (VD: 51A-123.58 hoặc 51A-1234)</FormLabel>
                                <Controller
                                    name="registrationNumber"
                                    control={methods.control}
                                    rules={{
                                        required: 'Biển số xe là bắt buộc',
                                        pattern: {
                                            value: /^([0-9]{2})[A-Z]-[0-9]{3}\.[0-9]{2}$|^([0-9]{2})[A-Z]-[0-9]{4}$/,
                                            message: 'Biển số xe không đúng định dạng (VD: 51A-123.58 hoặc 51A-1234)',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            type="text"
                                            fullWidth
                                            placeholder="VD: 51A-123.58 hoặc 51A-1234"
                                            variant="outlined"
                                            error={!!errors.registrationNumber}
                                            helperText={errors.registrationNumber?.message}
                                        />
                                    )}
                                />

                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Thương hiệu</FormLabel>
                                <Controller
                                    name="brand"
                                    control={methods.control}
                                    rules={{
                                        required: 'Thương hiệu là bắt buộc',
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            onChange={(e) => {
                                                const formatted = autoTrim(e.target.value);
                                                field.onChange(formatted);
                                            }}
                                            type="text"
                                            fullWidth
                                            placeholder="VD: Toyota, Honda"
                                            variant="outlined"
                                            error={!!errors.brand}
                                            helperText={errors.brand?.message}
                                        />
                                    )}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Hạng xe</FormLabel>
                                <Controller
                                    name="category"
                                    control={methods.control}
                                    rules={{
                                        required: 'Hạng xe là bắt buộc',
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            select
                                            fullWidth
                                            variant="outlined"
                                            error={!!errors.category}
                                            helperText={errors.category?.message}
                                            slotProps={{
                                                select: {
                                                    displayEmpty: true,
                                                    renderValue: (value: unknown) => {
                                                        if (!value) return <Typography>Chọn</Typography>;
                                                        return <>{value as string}</>;
                                                    },
                                                },
                                            }}
                                        >
                                            {Object.values(CarCategory).map((category) => (
                                                <MenuItem
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Năm sản xuất</FormLabel>
                                <Controller
                                    name="manufacturingYear"
                                    control={methods.control}
                                    rules={{
                                        required: 'Năm sản xuất là bắt buộc',
                                        min: {
                                            value: 2000,
                                            message: 'Năm sản xuất phải lớn hơn hoặc bằng 2000',
                                        }
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            type="number"
                                            fullWidth
                                            placeholder="VD: 2020"
                                            variant="outlined"
                                            error={!!errors.manufacturingYear}
                                            helperText={errors.manufacturingYear?.message}
                                        />
                                    )}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Chủ sở hữu</FormLabel>
                                <Controller
                                    name="owner"
                                    control={methods.control}
                                    rules={{
                                        required: 'Chủ sở hữu là bắt buộc',
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            fullWidth
                                            placeholder="VD: Nguyễn Văn An"
                                            variant="outlined"
                                            error={!!errors.owner}
                                            helperText={errors.owner?.message}
                                        />
                                    )}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Phanh kép</FormLabel>
                                <Controller
                                    name="hasDualBrake"
                                    control={methods.control}
                                    rules={{
                                        required: 'Phanh kép là bắt buộc',
                                    }}
                                    render={({ field }) => (
                                        <RadioGroup
                                            row
                                            value={field.value ?? ''}
                                            onChange={(e) => field.onChange(e.target.value === 'true')}
                                        >
                                            <FormControlLabel value="true" control={<Radio />} label="Có" />
                                            <FormControlLabel value="false" control={<Radio />} label="Không" />
                                        </RadioGroup>
                                    )}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Số GP xe tập lái</FormLabel>
                                <Controller
                                    name="practiceVehicleLicenseNumber"
                                    control={methods.control}
                                    rules={{
                                        required: 'Số giấy phép lái xe tập lái là bắt buộc',
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            onChange={(e) => {
                                                const formatted = autoTrimUppercaseRemoveSpecialChars(e.target.value);
                                                field.onChange(formatted);
                                            }}
                                            fullWidth
                                            placeholder="VD: GP-123456"
                                            variant="outlined"
                                            error={!!errors.practiceVehicleLicenseNumber}
                                            helperText={errors.practiceVehicleLicenseNumber?.message}
                                        />
                                    )}
                                />
                            </FormControl>

                            <DatePickerField
                                name="practiceVehicleLicenseIssueDate"
                                control={methods.control}
                                label="Ngày cấp GP xe tập lái"
                                required
                                error={!!methods.formState.errors.practiceVehicleLicenseIssueDate}
                                helperText={methods.formState.errors.practiceVehicleLicenseIssueDate?.message}
                                rules={{
                                    required: 'Ngày cấp GP lái xe tập lái là bắt buộc',
                                }}
                                triggerOnBlur="practiceVehicleLicenseExpiryDate"
                            />

                            <DatePickerField
                                name="practiceVehicleLicenseExpiryDate"
                                control={methods.control}
                                label="Ngày hết hạn GP xe tập lái"
                                required
                                error={!!methods.formState.errors.practiceVehicleLicenseExpiryDate}
                                helperText={methods.formState.errors.practiceVehicleLicenseExpiryDate?.message}
                                rules={{
                                    required: 'Ngày hết hạn GP lái xe tập lái là bắt buộc',
                                    validate: (value: Date) => {
                                        const issueDate = methods.getValues('practiceVehicleLicenseIssueDate');
                                        if (!value || !issueDate) return true;
                                        return dayjs(value).startOf('day').isAfter(dayjs(issueDate).startOf('day'))
                                            || 'Ngày hết hạn phải sau ngày cấp';
                                    },
                                }}
                                triggerOnBlur="practiceVehicleLicenseIssueDate"
                            />

                            <DatePickerField
                                name="inspectionIssueDate"
                                control={methods.control}
                                label="Ngày cấp đăng kiểm"
                                required
                                error={!!errors.inspectionIssueDate}
                                helperText={errors.inspectionIssueDate?.message}
                                rules={{
                                    required: 'Vui lòng nhập ngày cấp đăng kiểm'
                                }}
                                triggerOnBlur="inspectionExpiryDate"
                            />

                            <DatePickerField
                                name="inspectionExpiryDate"
                                control={methods.control}
                                label="Ngày hết hạn đăng kiểm"
                                required
                                error={!!errors.inspectionExpiryDate}
                                helperText={errors.inspectionExpiryDate?.message}
                                rules={{
                                    required: 'Vui lòng nhập ngày hết hạn đăng kiểm',
                                    validate: (value: Date) => {
                                        const issueDate = methods.getValues('inspectionIssueDate');
                                        if (!value || !issueDate) return true;
                                        return dayjs(value).startOf('day').isAfter(dayjs(issueDate).startOf('day')) || 'Ngày hết hạn phải sau ngày cấp';
                                    },
                                }}
                                triggerOnBlur="inspectionIssueDate"
                            />

                            <DatePickerField
                                name="insuranceExpiryDate"
                                control={methods.control}
                                label="Ngày hết hạn bảo hiểm"
                                required
                                error={!!errors.insuranceExpiryDate}
                                helperText={errors.insuranceExpiryDate?.message}
                                rules={{
                                    required: 'Vui lòng nhập ngày hết hạn bảo hiểm',
                                }}
                            />

                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Số imei DAT</FormLabel>
                                <Controller
                                    name="imeiDat"
                                    control={methods.control}
                                    rules={{
                                        required: 'Số IMEI DAT là bắt buộc',
                                        pattern: {
                                            value: /^[0-9]{15}$/,
                                            message: 'Số IMEI phải có đúng 15 chữ số',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            fullWidth
                                            placeholder="Nhập 15 chữ số (VD: 123123123123456)"
                                            variant="outlined"
                                            error={!!errors.imeiDat}
                                            helperText={errors.imeiDat?.message}
                                        />
                                    )}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Số seri</FormLabel>
                                <Controller
                                    name="serialNumber"
                                    control={methods.control}
                                    rules={{
                                        required: 'Số seri là bắt buộc',
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            onChange={(e) => {
                                                const formatted = autoTrimUppercaseRemoveSpecialChars(e.target.value);
                                                field.onChange(formatted);
                                            }}
                                            fullWidth
                                            placeholder="VD: 18-DG-28"
                                            variant="outlined"
                                            error={!!errors.serialNumber}
                                            helperText={errors.serialNumber?.message}
                                        />
                                    )}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <FormLabel>Trạng thái hoạt động</FormLabel>
                                <Controller
                                    name="isActive"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <RadioGroup
                                            row
                                            value={field.value ?? ''}
                                            onChange={(e) => field.onChange(e.target.value === 'true')}
                                        >
                                            <FormControlLabel value="true" control={<Radio />} label="Hoạt động" />
                                            <FormControlLabel value="false" control={<Radio />} label="Không hoạt động" />
                                        </RadioGroup>
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
                )}
            </Dialog>
        );
    }
);
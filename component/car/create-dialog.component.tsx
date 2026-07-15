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
    MenuItem,
    Typography,
    Grid,
    ToggleButton,
} from "@mui/material";

import { memo, useEffect } from "react";
import { Form } from "@/component/form.component";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { CreateCarDialogProps } from "@/model/car-dialog-props";
import { CreateCarModel } from "@/model/car.model";
import { autoTrimUppercaseRemoveSpecialChars, autoTrim } from "@/utils/format-input";
import { CarCategory } from "@/enum/car.enum";
import dayjs from "dayjs";
import { DatePickerField } from "../date-picker.component";
import { debounceUniqueChassisNumber, debounceUniqueEngineNumber, debounceUniqueImeiDat, debounceUniqueRegistrationNumber, debounceUniqueSerialNumber } from "@/utils/debounced-car";
import { RadioGroupField } from "../radio-button.component";
import { YesNoOptions } from "@/constants/radio-option";
import { SpacedToggleButtonGroup } from "@/style object/toggle-button-style";
import { DurationOptions } from "@/constants/duration";

export const CreateDialog = memo(
    ({ open, onClose, onSave }: CreateCarDialogProps) => {

        const methods = useForm<CreateCarModel>({
            mode: 'all',
            reValidateMode: 'onChange',
        });

        const errors = methods.formState.errors;

        const duration = methods.watch('duration');
        const issueDate = methods.watch('inspection_issue_date');

        useEffect(() => {
            if (duration && issueDate) {
                const expiry = dayjs(issueDate).add(duration, 'month').toDate();
                methods.setValue('inspection_expiry_date', expiry);
            }
        }, [issueDate, duration]);

        useEffect(() => { if (open) { methods.reset(); } }, [open]);
        const onSubmit: SubmitHandler<CreateCarModel> = (data) => {
            onSave({ ...data, hasDualBrake: data.hasDualBrake === 'true' });
        };

        const checkRegistrationNumber = async (value: string) => {
            if (!value) return true;
            const res = await debounceUniqueRegistrationNumber(value);
            return res || 'Biển số xe đã tồn tại';
        };

        const checkImeiDat = async (value: string) => {
            if (!value) return true;
            const res = await debounceUniqueImeiDat(value);
            return res || 'Số IMEI DAT đã tồn tại';
        };

        const checkSerialNumber = async (value: string) => {
            if (!value) return true;
            const res = await debounceUniqueSerialNumber(value);
            return res || 'Số seri đã tồn tại';
        };

        const checkChassisNumber = async (value: string) => {
            if (!value) return true;
            const res = await debounceUniqueChassisNumber(value);
            return res || 'Số khung đã tồn tại';
        }

        const checkEngineNumber = async (value: string) => {
            if (!value) return true;
            const res = await debounceUniqueEngineNumber(value);
            return res || 'Số máy đã tồn tại';
        }

        return (
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="lg"
                fullWidth
                scroll="paper"
            >
                <DialogTitle>Thêm xe tập lái mới</DialogTitle>
                <Form<CreateCarModel>
                    onSubmit={onSubmit}
                    methods={methods}
                >
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                                <FormControl fullWidth margin="dense">
                                    <FormLabel required>Biển số xe</FormLabel>
                                    <Controller
                                        name="registrationNumber"
                                        control={methods.control}
                                        rules={{
                                            required: 'Vui lòng nhập biển số xe',
                                            pattern: {
                                                value: /^([0-9]{2})[A-Z]-[0-9]{3}\.[0-9]{2}$|^([0-9]{2})[A-Z]-[0-9]{4}$/,
                                                message: 'Biển số xe không đúng định dạng',
                                            },
                                            validate: checkRegistrationNumber,
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                value={field.value ?? ''}
                                                type="text"
                                                fullWidth
                                                variant="outlined"
                                                placeholder="VD: 51A-123.58 hoặc 51A-1234"
                                                error={!!errors.registrationNumber}
                                                helperText={errors.registrationNumber?.message}
                                                slotProps={{
                                                    htmlInput: {
                                                        maxLength: 10,
                                                    },
                                                }}
                                            />
                                        )}
                                    />

                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                                <FormControl fullWidth margin="dense">
                                    <FormLabel required>Số khung</FormLabel>
                                    <Controller
                                        name="chassis_number"
                                        control={methods.control}
                                        rules={{
                                            required: 'Vui lòng nhập số khung xe',
                                            pattern: {
                                                value: /^[A-Z0-9]{1,20}$/,
                                                message: 'Số khung chỉ được chứa chữ cái in hoa và số, dấu gạch ngang, tối đa 20 ký tự',
                                            },
                                            validate: checkChassisNumber,
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const formatted = autoTrimUppercaseRemoveSpecialChars(e.target.value);
                                                    field.onChange(formatted);
                                                }}
                                                type="text"
                                                fullWidth
                                                placeholder="VD: ABC123"
                                                variant="outlined"
                                                error={!!errors.chassis_number}
                                                helperText={errors.chassis_number?.message}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                                <FormControl fullWidth margin="dense">
                                    <FormLabel required>Số máy</FormLabel>
                                    <Controller
                                        name="engine_number"
                                        control={methods.control}
                                        rules={{
                                            required: 'Vui lòng nhập số máy xe',
                                            pattern: {
                                                value: /^[A-Z0-9]{1,20}$/,
                                                message: 'Số máy chỉ được chứa chữ cái in hoa và số, dấu gạch ngang, tối đa 20 ký tự',
                                            },
                                            validate: checkEngineNumber
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const formatted = autoTrimUppercaseRemoveSpecialChars(e.target.value);
                                                    field.onChange(formatted);
                                                }}
                                                type="text"
                                                fullWidth
                                                placeholder="VD: ABC123"
                                                variant="outlined"
                                                error={!!errors.engine_number}
                                                helperText={errors.engine_number?.message}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                                <DatePickerField
                                    name="inspection_issue_date"
                                    label="Ngày cấp đăng kiểm"
                                    control={methods.control}
                                    required
                                    error={!!errors.inspection_issue_date}
                                    helperText={errors.inspection_issue_date?.message}
                                    rules={{ required: 'Vui lòng chọn ngày cấp đăng kiểm' }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                                <FormControl fullWidth margin="dense">
                                    <FormLabel>Thời hạn đăng kiểm</FormLabel>
                                    <Controller
                                        name="duration"
                                        control={methods.control}
                                        defaultValue={DurationOptions[0].value}
                                        render={({ field }) => (
                                            <SpacedToggleButtonGroup
                                                exclusive
                                                value={field.value}
                                                onChange={(_, value) => value && field.onChange(value)}
                                            >
                                                {DurationOptions.map((o) => (
                                                    <ToggleButton key={o.value} value={o.value} disabled={!issueDate} color="info">
                                                        {o.label}
                                                    </ToggleButton>
                                                ))}
                                            </SpacedToggleButtonGroup>
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                                <FormControl fullWidth margin="dense">
                                    <FormLabel required>Ngày hết hạn đăng kiểm</FormLabel>
                                    <Controller
                                        name="inspection_expiry_date"
                                        control={methods.control}
                                        rules={{ required: 'Vui lòng chọn ngày cấp và thời hạn đăng kiểm' }}
                                        render={({ field }) => (
                                            <TextField
                                                disabled
                                                fullWidth
                                                value={field.value ? dayjs(field.value).format('DD/MM/YYYY') : ''}
                                                error={!!errors.inspection_expiry_date}
                                                helperText={errors.inspection_expiry_date?.message}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                                <FormControl fullWidth margin="dense">
                                    <FormLabel required>Loại xe</FormLabel>
                                    <Controller
                                        name="vehicle_type"
                                        control={methods.control}
                                        rules={{
                                            required: 'Vui lòng nhập loại xe',
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                value={field.value ?? ''}
                                                type="text"
                                                fullWidth
                                                placeholder="VD: Xe con, Xe tải"
                                                variant="outlined"
                                                error={!!errors.vehicle_type}
                                                helperText={errors.vehicle_type?.message}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                                <FormControl fullWidth margin="dense">
                                    <FormLabel required>Thương hiệu</FormLabel>
                                    <Controller
                                        name="brand"
                                        control={methods.control}
                                        rules={{
                                            required: 'Vui lòng nhập thương hiệu xe',
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
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
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
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                                <FormControl fullWidth margin="dense">
                                    <FormLabel required>Năm sản xuất</FormLabel>
                                    <Controller
                                        name="manufacturingYear"
                                        control={methods.control}
                                        rules={{
                                            required: 'Vui lòng nhập năm sản xuất',
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
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                                <FormControl fullWidth margin="dense">
                                    <FormLabel required>Chủ sở hữu/hợp đồng</FormLabel>
                                    <Controller
                                        name="owner"
                                        control={methods.control}
                                        rules={{
                                            required: 'Vui lòng nhập Chủ sở hữu/hợp đồng'
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
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                                <RadioGroupField
                                    name="hasDualBrake"
                                    control={methods.control}
                                    label="Phanh phụ"
                                    options={YesNoOptions}
                                    required
                                    rules={{
                                        required: 'Vui lòng chọn phanh phụ',
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                                <FormControl fullWidth margin="dense">
                                    <FormLabel required>Số GP xe tập lái</FormLabel>
                                    <Controller
                                        name="practiceVehicleLicenseNumber"
                                        control={methods.control}
                                        rules={{
                                            required: 'Vui lòng nhập số giấy phép xe tập lái',
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
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                                <DatePickerField
                                    name="practiceVehicleLicenseIssueDate"
                                    control={methods.control}
                                    label="Ngày cấp GP xe tập lái"
                                    required
                                    error={!!errors.practiceVehicleLicenseIssueDate}
                                    helperText={errors.practiceVehicleLicenseIssueDate?.message}
                                    rules={{
                                        required: 'Ngày cấp GP lái xe tập lái là bắt buộc',
                                    }}
                                    triggerOnBlur="practiceVehicleLicenseExpiryDate"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                                <DatePickerField
                                    name="practiceVehicleLicenseExpiryDate"
                                    control={methods.control}
                                    label="Ngày hết hạn GP xe tập lái"
                                    required
                                    error={!!errors.practiceVehicleLicenseExpiryDate}
                                    helperText={errors.practiceVehicleLicenseExpiryDate?.message}
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
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
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
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                                <FormControl fullWidth margin="dense">
                                    <FormLabel required>Số imei DAT</FormLabel>
                                    <Controller
                                        name="imeiDat"
                                        control={methods.control}
                                        rules={{
                                            required: 'Vui lòng nhập số IMEI',
                                            pattern: {
                                                value: /^[0-9]{15}$/,
                                                message: 'Số IMEI phải có đúng 15 chữ số',
                                            },
                                            validate: checkImeiDat,
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                value={field.value ?? ''}
                                                fullWidth
                                                variant="outlined"
                                                placeholder="Nhập 15 chữ số (VD: 123123123123456)"
                                                error={!!errors.imeiDat}
                                                helperText={errors.imeiDat?.message}
                                                slotProps={{
                                                    htmlInput: {
                                                        maxLength: 15,
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                                <FormControl fullWidth margin="dense">
                                    <FormLabel required>Số seri</FormLabel>
                                    <Controller
                                        name="serialNumber"
                                        control={methods.control}
                                        rules={{
                                            required: 'Vui lòng nhập số seri',
                                            validate: checkSerialNumber,
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                onChange={(e) => {
                                                    const formatted = autoTrimUppercaseRemoveSpecialChars(e.target.value);
                                                    field.onChange(formatted);
                                                }}
                                                fullWidth
                                                variant="outlined"
                                                placeholder="VD: 18-DG-28"
                                                error={!!errors.serialNumber}
                                                helperText={errors.serialNumber?.message}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                        </Grid>
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
);
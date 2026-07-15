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
} from "@mui/material";

import { memo, useEffect } from "react";
import { Form } from "@/component/form.component";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { EditMultiCarDialogProps } from "@/model/car-dialog-props";
import { UpdateMultiCarModel } from "@/model/car.model";
import { CarCategory } from "@/enum/car.enum";
import { autoTrim } from "@/utils/format-input";
import { CAR_NOT_EMPTY_FIELDS } from "@/utils/not-emty-field";
import dayjs from "dayjs";
import { DatePickerField } from "../date-picker.component";
import { RadioGroupField } from "../radio-button.component";
import { ActiveStatusOptions, YesNoOptions } from "@/constants/radio-option";

export const EditMultiCarDialog = memo(
    ({ open, selectedIds, onClose, onSave, }: EditMultiCarDialogProps) => {

        const methods = useForm<UpdateMultiCarModel>({
            mode: "onChange",
            reValidateMode: "onChange",
            defaultValues: {},
        });

        const errors = methods.formState.errors;

        useEffect(() => {
            if (open) { methods.reset(); }
        }, [open]);

        const onSubmit: SubmitHandler<UpdateMultiCarModel> = async (data) => {
            CAR_NOT_EMPTY_FIELDS.forEach(field => {
                if (data[field] === '' || data[field] == null) {
                    delete data[field];
                }
            });
            onSave(selectedIds, {
                ...data,
                hasDualBrake: data.hasDualBrake ? data.hasDualBrake?.toString() === 'true' : undefined,
                isActive: data.isActive ? data.isActive?.toString() === 'true' : undefined,
            });
        };

        return (
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="lg"
                fullWidth
                scroll="paper"
            >
                <DialogTitle>Cập nhật xe tập lái</DialogTitle>

                <Form<UpdateMultiCarModel>
                    onSubmit={onSubmit}
                    methods={methods}
                >
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                                <FormControl fullWidth margin="dense">
                                    <FormLabel>Loại xe</FormLabel>
                                    <Controller
                                        name="vehicle_type"
                                        control={methods.control}
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
                                    <FormLabel>Thương hiệu</FormLabel>
                                    <Controller
                                        name="brand"
                                        control={methods.control}
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
                                    <FormLabel>Hạng xe</FormLabel>
                                    <Controller
                                        name="category"
                                        control={methods.control}
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
                                    <FormLabel>Năm sản xuất</FormLabel>
                                    <Controller
                                        name="manufacturingYear"
                                        control={methods.control}
                                        rules={{
                                            min: {
                                                value: 2000,
                                                message: 'Năm sản xuất phải lớn hơn hoặc bằng 2000',
                                            },
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
                                    <FormLabel>Chủ sở hữu/hợp đồng</FormLabel>
                                    <Controller
                                        name="owner"
                                        control={methods.control}
                                        rules={{
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
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                                <DatePickerField
                                    name="practiceVehicleLicenseIssueDate"
                                    control={methods.control}
                                    label="Ngày cấp GP xe tập lái"
                                    error={!!errors.practiceVehicleLicenseIssueDate}
                                    helperText={errors.practiceVehicleLicenseIssueDate?.message}
                                    triggerOnBlur="practiceVehicleLicenseExpiryDate"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                                <DatePickerField
                                    name="practiceVehicleLicenseExpiryDate"
                                    control={methods.control}
                                    label="Ngày hết hạn GP xe tập lái"
                                    error={!!errors.practiceVehicleLicenseExpiryDate}
                                    helperText={errors.practiceVehicleLicenseExpiryDate?.message}
                                    rules={{
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
                                    error={!!errors.insuranceExpiryDate}
                                    helperText={errors.insuranceExpiryDate?.message}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                                <RadioGroupField
                                    name="isActive"
                                    control={methods.control}
                                    label="Trạng thái hoạt động"
                                    options={ActiveStatusOptions}
                                />
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
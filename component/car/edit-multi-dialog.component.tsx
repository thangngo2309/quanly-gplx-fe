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
    RadioGroup,
    Radio,
    FormControlLabel,
    MenuItem,
    Typography,
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
            onSave(selectedIds, data);
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
                    <Form<UpdateMultiCarModel>
                        onSubmit={onSubmit}
                        methods={methods}
                    >
                        <DialogContent>

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

                            <FormControl fullWidth margin="dense">
                                <FormLabel>Chủ sở hữu</FormLabel>
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

                            <FormControl fullWidth margin="dense">
                                <FormLabel>Phanh kép</FormLabel>
                                <Controller
                                    name="hasDualBrake"
                                    control={methods.control}
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

                            <DatePickerField
                                name="practiceVehicleLicenseIssueDate"
                                control={methods.control}
                                label="Ngày cấp GP xe tập lái"
                                error={!!methods.formState.errors.practiceVehicleLicenseIssueDate}
                                helperText={methods.formState.errors.practiceVehicleLicenseIssueDate?.message}
                                triggerOnBlur="practiceVehicleLicenseExpiryDate"
                            />

                            <DatePickerField
                                name="practiceVehicleLicenseExpiryDate"
                                control={methods.control}
                                label="Ngày hết hạn GP xe tập lái"
                                error={!!methods.formState.errors.practiceVehicleLicenseExpiryDate}
                                helperText={methods.formState.errors.practiceVehicleLicenseExpiryDate?.message}
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

                            <DatePickerField
                                name="inspectionIssueDate"
                                control={methods.control}
                                label="Ngày cấp đăng kiểm"
                                error={!!errors.inspectionIssueDate}
                                helperText={errors.inspectionIssueDate?.message}
                                triggerOnBlur="inspectionExpiryDate"
                            />

                            <DatePickerField
                                name="inspectionExpiryDate"
                                control={methods.control}
                                label="Ngày hết hạn đăng kiểm"
                                error={!!errors.inspectionExpiryDate}
                                helperText={errors.inspectionExpiryDate?.message}
                                rules={{
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
                                error={!!errors.insuranceExpiryDate}
                                helperText={errors.insuranceExpiryDate?.message}
                            />

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
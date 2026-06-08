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
} from "@mui/material";

import { memo, useEffect } from "react";
import { Form } from "@/component/form.component";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { CreateCarDialogProps } from "@/model/car-dialog-props";
import { CreateCarModel } from "@/model/car.model";
import { autoTrimUppercaseRemoveSpecialChars, autoTrim } from "@/utils/format-input";
import { CarCategory } from "@/enum/car.enum";

export const CreateDialog = memo(
    ({ open, onClose, onSave }: CreateCarDialogProps) => {

        const methods = useForm<CreateCarModel>({
            mode: 'onBlur',
            reValidateMode: 'onChange',
        });

        const errors = methods.formState.errors;

        useEffect(() => { if (open) { methods.reset(); } }, [open]);
        const onSubmit: SubmitHandler<CreateCarModel> = async (data) => {
            onSave(data);
        };

        return (
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                scroll="paper"
            >
                <DialogTitle>Thêm xe tập lái mới</DialogTitle>

                {open && (
                    <Form<CreateCarModel>
                        onSubmit={onSubmit}
                        methods={methods}
                    >
                        <DialogContent>

                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Biển số xe</FormLabel>
                                <Controller
                                    name="registrationNumber"
                                    control={methods.control}
                                    rules={{
                                        required: 'Vui lòng nhập biển số xe (VD: 51A-123.58 hoặc 51A-1234)',
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
                                            variant="outlined"
                                            placeholder="VD: 51A-123.58 hoặc 51A-1234"
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
                                            placeholder="VD: Toyota, Honda..."
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
                                        required: 'Vui lòng chọn hạng xe'
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

                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Chủ sở hữu</FormLabel>
                                <Controller
                                    name="owner"
                                    control={methods.control}
                                    rules={{
                                        required: 'Vui lòng nhập chủ sở hữu xe'
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
                                        required: 'Vui lòng chọn phanh kép',
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
                                            placeholder="VD: ABC/12345"
                                            variant="outlined"
                                            error={!!errors.practiceVehicleLicenseNumber}
                                            helperText={errors.practiceVehicleLicenseNumber?.message}
                                        />
                                    )}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Ngày cấp GP xe tập lái</FormLabel>
                                <Controller
                                    name="practiceVehicleLicenseIssueDate"
                                    control={methods.control}
                                    rules={{
                                        required: 'Vui lòng nhập ngày cấp GP xe tập lái'
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            fullWidth
                                            type="date"
                                            variant="outlined"
                                            error={!!errors.practiceVehicleLicenseIssueDate}
                                            helperText={errors.practiceVehicleLicenseIssueDate?.message}
                                        />
                                    )}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Ngày hết hạn GP xe tập lái</FormLabel>
                                <Controller
                                    name="practiceVehicleLicenseExpiryDate"
                                    control={methods.control}
                                    rules={{
                                        required: 'Vui lòng nhập ngày hết hạn',
                                        validate: (value) => {
                                            const issueDate = methods.getValues('practiceVehicleLicenseIssueDate');
                                            if (issueDate && value <= issueDate) {
                                                return 'Ngày hết hạn phải sau ngày cấp';
                                            }
                                            return true;
                                        },
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            fullWidth
                                            type="date"
                                            variant="outlined"
                                            error={!!errors.practiceVehicleLicenseExpiryDate}
                                            helperText={errors.practiceVehicleLicenseExpiryDate?.message}
                                        />
                                    )}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Ngày cấp đăng kiểm</FormLabel>
                                <Controller
                                    name="inspectionIssueDate"
                                    control={methods.control}
                                    rules={{
                                        required: 'Vui lòng nhập ngày cấp đăng kiểm'
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            fullWidth
                                            type="date"
                                            variant="outlined"
                                            error={!!errors.inspectionIssueDate}
                                            helperText={errors.inspectionIssueDate?.message}
                                        />
                                    )}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Ngày hết hạn đăng kiểm</FormLabel>
                                <Controller
                                    name="inspectionExpiryDate"
                                    control={methods.control}
                                    rules={{
                                        required: 'Vui lòng nhập ngày hết hạn đăng kiểm',
                                        validate: (value) => {
                                            const issueDate = methods.getValues('inspectionIssueDate');
                                            if (issueDate && value <= issueDate) {
                                                return 'Ngày hết hạn phải sau ngày cấp';
                                            }
                                            return true;
                                        },
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            fullWidth
                                            type="date"
                                            variant="outlined"
                                            error={!!errors.inspectionExpiryDate}
                                            helperText={errors.inspectionExpiryDate?.message}
                                        />
                                    )}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <FormLabel required>Ngày hết hạn bảo hiểm</FormLabel>
                                <Controller
                                    name="insuranceExpiryDate"
                                    control={methods.control}
                                    rules={{
                                        required: 'Vui lòng nhập ngày hết hạn bảo hiểm',
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            fullWidth
                                            type="date"
                                            variant="outlined"
                                            error={!!errors.insuranceExpiryDate}
                                            helperText={errors.insuranceExpiryDate?.message}
                                        />
                                    )}
                                />
                            </FormControl>

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
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            fullWidth
                                            variant="outlined"
                                            placeholder="VD: 123456789012345"
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
                                        required: 'Vui lòng nhập số seri',
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
                                            placeholder="VD: ABC-12345"
                                            error={!!errors.serialNumber}
                                            helperText={errors.serialNumber?.message}
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
                )}
            </Dialog>
        );
    }
);
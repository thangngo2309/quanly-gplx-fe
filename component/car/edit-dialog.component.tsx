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
} from "@mui/material";

import { memo, useEffect } from "react";
import { Form } from "@/component/form.component";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { EditCarDialogProps } from "@/model/car-dialog-props";
import { UpdateCarModel } from "@/model/car.model";
import { autoTrim, autoTrimUppercaseRemoveSpecialChars } from "@/utils/format-input";
import { CarCategory } from "@/enum/car.enum";

export const EditDialog = memo(
    ({ open, onClose, onSave, data }: EditCarDialogProps) => {

        const methods = useForm<UpdateCarModel>({
            mode: 'onTouched',
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
                                <FormLabel>Biển số xe (VD: 51A-123.58 hoặc 51A-1234)</FormLabel>
                                <Controller
                                    name="registrationNumber"
                                    control={methods.control}
                                    rules={{
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
                                            error={!!errors.registrationNumber}
                                            helperText={errors.registrationNumber?.message}
                                        />
                                    )}
                                />

                            </FormControl>

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
                                        }
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            type="number"
                                            fullWidth
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
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            fullWidth
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

                            <FormControl fullWidth margin="dense">
                                <FormLabel>Số giấy phép lái xe thực hành</FormLabel>
                                <Controller
                                    name="practiceVehicleLicenseNumber"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            onChange={(e) => {
                                                const formatted = autoTrimUppercaseRemoveSpecialChars(e.target.value);
                                                field.onChange(formatted);
                                            }}
                                            fullWidth
                                            variant="outlined"
                                            error={!!errors.practiceVehicleLicenseNumber}
                                            helperText={errors.practiceVehicleLicenseNumber?.message}
                                        />
                                    )}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <FormLabel>Ngày cấp GP lái xe thực hành</FormLabel>
                                <Controller
                                    name="practiceVehicleLicenseIssueDate"
                                    control={methods.control}
                                    rules={{
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                methods.trigger('inspectionExpiryDate');
                                            }}
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
                                <FormLabel>Ngày hết hạn GP lái xe thực hành</FormLabel>
                                <Controller
                                    name="practiceVehicleLicenseExpiryDate"
                                    control={methods.control}
                                    rules={{
                                        validate: (value) => {
                                            const issueDate = methods.getValues('practiceVehicleLicenseIssueDate');
                                            if (value && issueDate && value <= issueDate) {
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
                                <FormLabel>Ngày cấp đăng kiểm</FormLabel>
                                <Controller
                                    name="inspectionIssueDate"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                methods.trigger('practiceVehicleLicenseExpiryDate');
                                            }}
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
                                <FormLabel>Ngày hết hạn đăng kiểm</FormLabel>
                                <Controller
                                    name="inspectionExpiryDate"
                                    control={methods.control}
                                    rules={{
                                        validate: (value) => {
                                            const issueDate = methods.getValues('inspectionIssueDate');
                                            if (value && issueDate && value <= issueDate) {
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
                                <FormLabel>Ngày hết hạn bảo hiểm</FormLabel>
                                <Controller
                                    name="insuranceExpiryDate"
                                    control={methods.control}
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
                                <FormLabel>Số imei DAT</FormLabel>
                                <Controller
                                    name="imeiDat"
                                    control={methods.control}
                                    rules={{
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
                                            error={!!errors.imeiDat}
                                            helperText={errors.imeiDat?.message}
                                        />
                                    )}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <FormLabel>Số seri</FormLabel>
                                <Controller
                                    name="serialNumber"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            onChange={(e) => {
                                                const formatted = autoTrimUppercaseRemoveSpecialChars(e.target.value);
                                                field.onChange(formatted);
                                            }}
                                            fullWidth
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
                                        <RadioGroup {...field} row>
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
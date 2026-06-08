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
import { EditMultiCarDialogProps } from "@/model/car-dialog-props";
import { UpdateMultiCarModel } from "@/model/car.model";
import { CarCategory } from "@/enum/car.enum";
import { autoTrim } from "@/utils/format-input";
import { CAR_NOT_EMPTY_FIELDS } from "@/utils/not-emty-field";

export const EditMultiCarDialog = memo(
    ({ open, selectedIds, onClose, onSave, }: EditMultiCarDialogProps) => {

        const methods = useForm<UpdateMultiCarModel>({
            mode: "onTouched",
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
                                        },
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
                                    rules={{
                                    }}
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
                                <FormLabel>Ngày cấp GP xe tập lái</FormLabel>
                                <Controller
                                    name="practiceVehicleLicenseIssueDate"
                                    control={methods.control}
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
                                <FormLabel>Ngày hết hạn GP xe tập lái</FormLabel>
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
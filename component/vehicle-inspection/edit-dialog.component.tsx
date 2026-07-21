import { EditVehicleInspectionDialogProps } from "@/model/vehicle-inspection-dialog-props";
import { UpdateVehicleInspectionModel } from "@/model/vehicle-inspection.model";
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, TextField, ToggleButton } from "@mui/material";
import { memo, useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Form } from "../form.component";
import { DatePickerField } from "../date-picker.component";
import dayjs from "dayjs";
import { SpacedToggleButtonGroup } from "@/style object/toggle-button-style";
import { RadioGroupField } from "../radio-button.component";
import { ActiveStatusOptions } from "@/constants/radio-option";
import { DurationOptions } from "@/constants/duration";

export const EditDialog = memo(({ open, cars, onClose, onSave, data }: EditVehicleInspectionDialogProps) => {
    const methods = useForm<UpdateVehicleInspectionModel>({
        mode: 'all',
        reValidateMode: 'onChange',
    });

    const errors = methods.formState.errors;

    const [duration, setDuration] = useState<number>();

    const issueDate = methods.watch('inspection_issue_date');

    useEffect(() => {
        if (duration && issueDate) {
            const expiry = dayjs(issueDate).add(duration, 'month').subtract(1, 'day').format("YYYY-MM-DD");
            methods.setValue('inspection_expiry_date', expiry);
        }
    }, [issueDate, duration]);

    useEffect(() => {
        if (open && data) {
            methods.reset(data);
            const issue = dayjs(data.inspection_issue_date);
            const expiry = dayjs(data.inspection_expiry_date);
            const diffMonths = expiry.add(1, 'day').diff(issue, 'month');
            setDuration(DurationOptions.find((o) => o.value === diffMonths)?.value);
        }
    }, [open, data]);

    const onSubmit: SubmitHandler<UpdateVehicleInspectionModel> = (formData) => {
        onSave({
            ...formData,
            is_active: formData.is_active ? formData.is_active?.toString() === 'true' : undefined,
        });
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
            <DialogTitle>Chỉnh sửa đăng kiểm xe</DialogTitle>
            <Form<UpdateVehicleInspectionModel> methods={methods} onSubmit={onSubmit}>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <FormLabel required>Chọn xe</FormLabel>
                        <Controller
                            name="car_id"
                            control={methods.control}
                            rules={{ required: 'Vui lòng chọn xe' }}
                            render={({ field }) => (
                                <Autocomplete
                                    options={cars}
                                    getOptionLabel={(option) => `${option.registrationNumber}`}
                                    value={cars.find((c) => c.car_id === field.value) || null}
                                    onChange={(_, value) => field.onChange(value?.car_id ?? null)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="VD: 54A-1234 hoặc 54A-123.45"
                                            error={!!errors.car_id}
                                            helperText={errors.car_id?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                    </FormControl>

                    <DatePickerField
                        name="inspection_issue_date"
                        label="Ngày cấp đăng kiểm"
                        control={methods.control}
                        required
                        error={!!errors.inspection_issue_date}
                        helperText={errors.inspection_issue_date?.message}
                        rules={{ required: 'Vui lòng chọn ngày cấp đăng kiểm' }}
                    />

                    <FormControl fullWidth margin="dense">
                        <FormLabel>Thời hạn đăng kiểm</FormLabel>
                        <SpacedToggleButtonGroup
                            exclusive
                            value={duration}
                            onChange={(_, value) => value && setDuration(value)}
                        >
                            {DurationOptions.map((o) => (
                                <ToggleButton key={o.value} value={o.value} disabled={!issueDate} color="info">
                                    {o.label}
                                </ToggleButton>
                            ))}
                        </SpacedToggleButtonGroup>
                    </FormControl>

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

                        <RadioGroupField
                            name="is_active"
                            control={methods.control}
                            label="Trạng thái hoạt động"
                            options={ActiveStatusOptions}
                        />
                    </FormControl>

                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button type="submit" variant="contained" color="primary">
                        Lưu
                    </Button>
                </DialogActions>
            </Form>
        </Dialog>
    );
});
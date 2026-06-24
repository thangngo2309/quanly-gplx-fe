import { FormControl, FormLabel } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Control, Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import { useEffect } from "react";

export interface DatePickerFieldProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    label: string;
    required?: boolean;
    error?: boolean;
    helperText?: string;
    triggerOnBlur?: Path<T>;
    rules?: any;
}

export const DatePickerField = <T extends FieldValues>({
    name,
    control,
    label,
    required = false,
    error = false,
    helperText = '',
    triggerOnBlur,
    rules = {},
}: DatePickerFieldProps<T>) => {
    const { trigger, watch, getFieldState } = useFormContext<T>();
    const currentValue = watch(name);
    useEffect(() => {
        if (triggerOnBlur) {
            const isDirty = getFieldState(triggerOnBlur).isDirty;
            if (isDirty) {
                trigger(triggerOnBlur);
            }
        }
    }, [currentValue]);
    return (
        <FormControl fullWidth margin="dense">
            <FormLabel required={required}>{label}</FormLabel>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field }) => (
                    <DatePicker
                        {...field}
                        format="DD/MM/YYYY"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newDate) => {
                            field.onChange(newDate ? newDate.format('YYYY-MM-DD') : null);
                        }}
                        localeText={{
                            fieldDayPlaceholder: () => '30',
                            fieldMonthPlaceholder: () => '12',
                            fieldYearPlaceholder: () => '2025',
                        }}
                        slotProps={{
                            textField: {
                                ...field,
                                fullWidth: true,
                                variant: 'outlined',
                                error: error,
                                helperText: helperText,
                            },
                        }}
                    />
                )}
            />
        </FormControl>
    );
};
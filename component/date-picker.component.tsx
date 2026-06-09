import { FormControl, FormLabel } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import dayjs from "dayjs";

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
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                variant: 'outlined',
                                error: error,
                                helperText: helperText,
                                onBlur: () => {
                                    field.onBlur();
                                    if (triggerOnBlur) {
                                        control._formValues;
                                    }
                                },
                            },
                        }}
                    />
                )}
            />
        </FormControl>
    );
};
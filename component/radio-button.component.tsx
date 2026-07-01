'use client';

import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface RadioOption {
    value: string;
    label: string;
}

export interface RadioGroupFieldProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    label: string;
    required?: boolean;
    options: RadioOption[];
    row?: boolean;
    margin?: 'dense' | 'normal' | 'none';
    rules?: any;
}

export const RadioGroupField = <T extends FieldValues>({
    name,
    control,
    label,
    required = false,
    options,
    row = true,
    rules,
    margin = 'dense',
    ...props
}: RadioGroupFieldProps<T>) => {
    return (
        <FormControl {...props} fullWidth margin={margin}>
            <FormLabel required={required}>{label}</FormLabel>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field, fieldState: { error } }) => (
                    <>
                        <RadioGroup {...field} row={row} value={field.value ?? ''}>
                            {options.map((opt) => (
                                <FormControlLabel
                                    key={opt.value}
                                    value={opt.value}
                                    control={<Radio />}
                                    label={opt.label}
                                />
                            ))}
                        </RadioGroup>
                        {error && (
                            <FormHelperText error>{error.message}</FormHelperText>
                        )}
                    </>
                )}
            />
        </FormControl>
    );
};
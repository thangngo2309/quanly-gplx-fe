'use client';

import { ErrorStyle } from '@/style object/content.style';
import { FormProps } from '@/model/form.model';
import { FormProvider, FieldValues} from 'react-hook-form';
import { Box } from '@mui/material';

export function Form<T extends FieldValues>({ children, onSubmit, methods, error, sx }: FormProps<T>) {
  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={methods.handleSubmit(onSubmit)}
        sx={sx}
      >
        {children}
        {error && (
          <ErrorStyle>
            {error}
          </ErrorStyle>
        )}
      </Box>
    </FormProvider>
  );
}
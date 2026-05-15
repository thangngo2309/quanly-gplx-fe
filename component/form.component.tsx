'use client';

import { ErrorStyle } from '@/style object/content.style';
import { FormProps } from '@/model/form.model';
import { FormProvider, FieldValues} from 'react-hook-form';

export function Form<T extends FieldValues>({ children, onSubmit, methods, error }: FormProps<T>)  {
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {children}
        {error && (
          <ErrorStyle>
            {error}
          </ErrorStyle>
        )}
      </form>
    </FormProvider>
  );
}
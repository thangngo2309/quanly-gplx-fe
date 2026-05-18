import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

export interface FormProps<T extends FieldValues> {
  children: React.ReactNode;
  onSubmit: SubmitHandler<T>;
  methods: ReturnType<typeof useForm<T>>;
  error?: string | null
}
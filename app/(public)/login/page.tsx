'use client';

import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { login } from '@/api/auth';
import { setAuthTokens } from '@/utils/localstorage';
import { toast } from 'react-toastify';
import { PageContainer, StyledCard } from '@/style object/login.style';
import { Form } from '@/component/form.component';
import { Button, CssBaseline, FormControl, FormLabel, TextField, Typography } from '@mui/material';
import { FormBox } from '@/style object/login.style';

type LoginForm = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();

  const methods = useForm<LoginForm>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { username: '', password: '' }
  });

  const errors = methods.formState.errors;

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      const res = await login(data.username, data.password);
      setAuthTokens(res.access_token, res.refresh_token);
      toast.success('Đăng nhập thành công!');
      router.push('/');
    } catch (err: any) {
      toast.error('Sai tên đăng nhập hoặc mật khẩu!');
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <PageContainer direction="column">
        <StyledCard variant="outlined">
          <Typography component="h1" variant="h4">
            Đăng nhập
          </Typography>

          <Form<LoginForm> onSubmit={onSubmit} methods={methods}>
            <FormBox>
              <FormControl>
                <FormLabel htmlFor="username">Tên đăng nhập</FormLabel>
                <Controller
                  name="username"
                  control={methods.control}
                  rules={{
                    required: 'Vui lòng nhập tên đăng nhập',
                    minLength: { value: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: 'Tên đăng nhập chỉ gồm chữ, số và dấu gạch dưới (_), không chứa dấu cách hoặc ký tự khác'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="username"
                      placeholder="Nhập tên đăng nhập"
                      fullWidth
                      variant="outlined"
                      error={!!errors.username}
                      helperText={errors.username?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="password">Mật khẩu</FormLabel>
                <Controller
                  name="password"
                  control={methods.control}
                  rules={{
                    required: 'Vui lòng nhập mật khẩu',
                    minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="password"
                      type="password"
                      placeholder="Nhập mật khẩu"
                      fullWidth
                      variant="outlined"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  )}
                />
              </FormControl>

              <Button type="submit" fullWidth variant="contained" color="primary">
                Đăng nhập
              </Button>
            </FormBox>
          </Form>
        </StyledCard>
      </PageContainer>
    </>
  );
}
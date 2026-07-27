'use client';

import { changePassword } from '@/api/user';
import { ChangePasswordDialog } from '@/component/user/change-password.dialog.component';
import { ChangePasswordForm } from '@/model/user.model';
import { useUserStore } from '@/store/useUser.store';

import {
  Container,
  Card,
  Title,
  InfoList,
  InfoRow,
  Label,
  Value,
} from '@/style object/profile.style';
import { clearAuthTokens } from '@/utils/localstorage';
import { Button } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { profile } = useUserStore();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const router = useRouter();

  const handleChangePassword = async (formData: ChangePasswordForm) => {
    try {
      await changePassword(profile!.user_id, formData);
      setChangePasswordOpen(false);
      toast.success('Cập nhật mật khẩu thành công');
      clearAuthTokens();
      router.push('/login');
    } catch (error) {
      toast.error('Cập nhật mật khẩu thất bại');
    }
  };

  return (
    <Container>
      <Card elevation={3}>
        <Title variant="h6">
          Thông tin người dùng
        </Title>

        <InfoList>
          <InfoRow>
            <Label>ID</Label>
            <Value>{profile?.user_id}</Value>
          </InfoRow>

          <InfoRow>
            <Label>Username</Label>
            <Value>{profile?.username}</Value>
          </InfoRow>

          <InfoRow>
            <Label>Tên</Label>
            <Value>{profile?.fullname}</Value>
          </InfoRow>

          <InfoRow>
            <Label>Role</Label>
            <Value>{profile?.role}</Value>
          </InfoRow>
        </InfoList>
        <Button variant="contained" color="primary" onClick={() => setChangePasswordOpen(true)}>
          Đổi mật khẩu
        </Button>
      </Card>
      <ChangePasswordDialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        onSave={handleChangePassword}
        user_id={profile!.user_id}
      />
    </Container>
  );
}
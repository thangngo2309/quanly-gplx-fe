'use client';

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

export default function ProfilePage() {
  const { profile } = useUserStore();

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
      </Card>
    </Container>
  );
}
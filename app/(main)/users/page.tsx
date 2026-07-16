'use client';

import Box from '@mui/material/Box';

import { GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid';

import {
  Button,
  Grid,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';

import {
  createUser,
  deleteUser,
  deleteMultipleUser,
  getAllUser,
  updateUser,
  UpdateMultipleUser,
  resetPasswordAPI,
} from '@/api/user';

import { useMemo, useState, useEffect, SyntheticEvent } from 'react';

import { USER_COLUMNS } from '@/constants/user-columns';
import { ActionColumn } from '@/component/data-grid/action-column';
import { CreateDialog } from '@/component/user/create-dialog.component';
import { EditDialog } from '@/component/user/edit-dialog.component';
import { EditMultiUserDialog } from '@/component/user/edit-multi-dialog.component';
import { SearchIconButtonStyle } from '@/style object/user-page.style';
import { FilterUserForm } from '@/model/user.model';
import Tooltip from '@mui/material/Tooltip';

import {
  CreateUserModel,
  UpdateMultiUserModel,
  UpdateUserModel,
  UserDataModel,
} from '@/model/user.model';
import { toast } from 'react-toastify';
import { Form } from '@/component/form.component';
import { Controller, useForm } from 'react-hook-form';
import { CommonDataTable } from '@/component/data-grid/common-data-table.component';
import { UserRole } from '@/enum/user.enum';
import { FIELDS_BY_ROLE } from '@/constants/user-tabs-config';
import { ResetPasswordButton } from '@/component/user/user-action.component';
import { useUserStore } from '@/store/useUser.store';
import { ResetPasswordDialog } from '@/component/user/reset-password-dialog.component';
import { ConfirmResetPasswordDialog } from '@/component/user/confirm-reset-password-dialog.component';

export default function UsersManagement() {

  const [data, setData] = useState<any>();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [multiEditOpen, setMultiEditOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDataModel | null>(null);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>(
    { type: 'include', ids: new Set() }
  );
  const [filter, setFilter] = useState<FilterUserForm>({
    role: UserRole.ADMIN,
    sortDirection: 'DESC',
  });
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.ADMIN);
  const profile = useUserStore((state) => state.profile);
  const [confirmResetDialog, setConfirmResetDialog] = useState(false);
  const [selectUserResetPassword, setSelectUserResetPassword] = useState<UserDataModel | null>(null);
  const [resetPasswordDialog, setResetPasswordDialog] = useState<{ open: boolean; password: string }>({
    open: false,
    password: '',
  });

  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
    fetchData();
  }, [pagination, filter, sortModel, activeTab])

  useEffect(() => {
    setRowSelectionModel({ type: 'include', ids: new Set() });
    setSelectedIds([]);
  }, [pagination.page]);

  const methods = useForm<FilterUserForm>();

  const fetchData = async () => {
    const res = await getAllUser(
      {
        name: filter.name,
        cccd: filter.cccd,
        phone_number: filter.phone_number,
        email: filter.email,
        role: activeTab,
        active: filter.active,
        sortBy: sortModel[0]?.field || filter.sortBy,
        sortDirection: sortModel[0]
          ? sortModel[0].sort === 'desc' ? 'DESC' : 'ASC'
          : filter.sortDirection,
      },
      pagination.page + 1,
      pagination.pageSize
    );
    setData(res);
  };

  const onSubmit = (formData: FilterUserForm) => {
    setFilter(prev => ({
      ...prev,
      ...formData,
    }));
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const handleCreate = async (formData: CreateUserModel) => {
    await createUser(formData);
    setCreateOpen(false);
    fetchData();
    toast.success('Tạo người dùng thành công');
  };

  const handleEdit = async (formData: UpdateUserModel) => {
    if (!selectedUser) return;
    await updateUser(selectedUser.user_id, formData);
    setEditOpen(false);
    fetchData();
    toast.success('Cập nhật người dùng thành công');
  };

  const handleMultiEdit = async (userIds: number[], formData: UpdateMultiUserModel) => {
    await UpdateMultipleUser(userIds, formData);
    setMultiEditOpen(false);
    fetchData();
    toast.success('Cập nhật người dùng thành công');
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    fetchData();
    toast.success('Xóa người dùng thành công');
  };

  const handleDeleteMultiple = async () => {
    if (!selectedIds.length) return;
    await deleteMultipleUser(selectedIds);
    fetchData();
    toast.success('Xóa người dùng thành công');
  };

  const handleTabChange = (_: SyntheticEvent, newValue: UserRole) => {
    setActiveTab(newValue);
    setSelectedIds([]);
    setRowSelectionModel({ type: 'include', ids: new Set() });
    setPagination(prev => ({ ...prev, page: 0 }));
    setFilter({
      role: newValue,
      sortDirection: 'DESC',
    });
    methods.reset();
  };

  const handleConfirmResetPassword = async () => {
    if (!selectUserResetPassword) return;
    try {
      const res = await resetPasswordAPI(selectUserResetPassword.user_id);
      const newPassword = res.password;

      setConfirmResetDialog(false);

      setResetPasswordDialog({
        open: true,
        password: newPassword,
      });

      toast.success('Đặt lại mật khẩu thành công');
    } catch (error) {
      toast.error('Đặt lại mật khẩu thất bại');
    }
  };


  const columns = useMemo(() => {
    const allowedFields = FIELDS_BY_ROLE[activeTab] ?? [];
    const filteredColumns = USER_COLUMNS.filter(col => allowedFields.includes(col.field));

    return [
      ...filteredColumns,
      ActionColumn<UserDataModel>({
        onEdit: (row) => {
          setSelectedUser(row);
          setEditOpen(true);
        },
        onDelete: handleDelete,
        getDeleteId: (row) => row.user_id,
        getDeleteLabel: (row) => row.fullname,

        customAction: (user) => {
          if (profile?.role !== UserRole.ADMIN) return null;
          return (
            <ResetPasswordButton
              user={user}
              onResetPassword={(row) => {
                setSelectUserResetPassword(row);
                setConfirmResetDialog(true);
              }}
            />
          );
        }
      }),
    ];
  }, [activeTab, profile]);

  return (
    <Box>

      <Typography variant="h6" gutterBottom>
        Quản lý người dùng
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        mb={2}
        alignItems={{ xs: 'stretch', lg: 'center' }}
        justifyContent="space-between"
      >

        <Grid size="auto">
          <Stack direction="row" spacing={1}>
            <Tooltip title="Tạo mới">
              <Button
                variant="outlined"
                color="success"
                onClick={() => setCreateOpen(true)}
              >
                <AddCircleIcon />
              </Button>
            </Tooltip>

            <Tooltip title="Xóa hàng loạt">
              <Button
                variant="outlined"
                color="error"
                disabled={!selectedIds.length}
                onClick={() => {
                  const selectedNames = data?.data
                    ?.filter((user: UserDataModel) => selectedIds.includes(user.user_id))
                    .map((user: UserDataModel) => user.fullname)
                    .join(', ');

                  if (confirm(`Bạn có chắc chắn muốn xóa: ${selectedNames}?`)) {
                    handleDeleteMultiple();
                  }
                }}
              >
                <DeleteIcon />
              </Button>
            </Tooltip>

            <Tooltip title="Chỉnh sửa hàng loạt">
              <Button
                variant="outlined"
                color="primary"
                disabled={!selectedIds.length}
                onClick={() => setMultiEditOpen(true)}
              >
                <EditIcon />
              </Button>
            </Tooltip>

          </Stack>
        </ Grid>

        <Grid size="grow" display="flex" justifyContent="flex-end">
          <Form methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                <Controller
                  name="name"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      size="small"
                      label="Tìm theo họ tên"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <Controller
                  name="cccd"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      size="small"
                      label="Tìm theo CCCD"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <Controller
                  name="phone_number"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      size="small"
                      label="Số điện thoại"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                <Controller
                  name="email"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      size="small"
                      label="Email"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 9, sm: 5, md: 2 }}>
                <Controller
                  name="active"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      select
                      label="Trạng thái"
                      size="small"
                      fullWidth
                      value={field.value === undefined ? 'empty' : String(field.value)}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === 'empty'
                            ? undefined
                            : e.target.value === 'true'
                        )
                      }
                    >
                      <MenuItem value="empty">Tất cả</MenuItem>
                      <MenuItem value="true">Hoạt động</MenuItem>
                      <MenuItem value="false">Không hoạt động</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 2, sm: 1 }}>
                <Tooltip title="Tìm kiếm">
                  <SearchIconButtonStyle type="submit">
                    <SearchIcon />
                  </SearchIconButtonStyle>
                </Tooltip>
              </Grid>
            </Grid>
          </Form>
        </Grid>
      </Stack>

      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Quản trị viên" value={UserRole.ADMIN} />
        <Tab label="Giáo viên" value={UserRole.TEACHER} />
        <Tab label="Người dùng" value={UserRole.USER} />
      </Tabs>

      <CommonDataTable<UserDataModel>
        columns={columns}
        rows={data?.data || []}
        rowCount={data?.meta?.itemCount || 0}
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        getRowId={(row) => row.user_id}
        rowSelectionModel={rowSelectionModel}
        onSelectedIdsChange={setSelectedIds}
        onRowSelectionModelChange={setRowSelectionModel}
      />

      <CreateDialog
        open={createOpen}
        role={activeTab}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
      />

      {selectedUser && (
        <EditDialog
          open={editOpen}
          selectedId={selectedUser?.user_id || 0}
          role={activeTab}
          onClose={() => setEditOpen(false)}
          onSave={handleEdit}
          data={selectedUser}
        />
      )}

      <EditMultiUserDialog
        open={multiEditOpen}
        selectedIds={selectedIds}
        role={activeTab}
        onClose={() => setMultiEditOpen(false)}
        onSave={handleMultiEdit}
      />

      <ConfirmResetPasswordDialog
        open={confirmResetDialog}
        user={selectUserResetPassword}
        onClose={() => setConfirmResetDialog(false)}
        onConfirm={handleConfirmResetPassword}
      />

      <ResetPasswordDialog
        open={resetPasswordDialog.open}
        newPassword={resetPasswordDialog.password}
        onClose={() => setResetPasswordDialog({ open: false, password: '' })}
      />
    </Box>
  );
}
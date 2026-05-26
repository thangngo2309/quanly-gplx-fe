'use client';

import Box from '@mui/material/Box';

import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';

import {
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
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
} from '@/lib/user';

import { useCallback, useEffect, useMemo, useState, } from 'react';

import { USER_COLUMNS } from '@/constants/user-columns';
import { ActionColumn } from '@/component/data-grid/action-column';
import { CreateDialog } from '@/component/data-grid/user/create-dialog.component';
import { EditDialog } from '@/component/data-grid/user/edit-dialog.component';
import { EditMultiUserDialog } from '@/component/data-grid/user/edit-multi-dialog.component';
import { SearchIconButtonStyle } from '@/style object/user-page.style';
import { FilterUserForm } from '@/model/user.model';

import {
  CreateUserModel,
  UpdateMultiUserModel,
  UpdateUserModel,
  UserDataModel,
  UserModel,
} from '@/model/user.model';
import { toast } from 'react-toastify';
import { Form } from '@/component/form.component';
import { Controller, useForm } from 'react-hook-form';

export default function UsersManagement() {

  const [data, setData] = useState<UserModel | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [multiEditOpen, setMultiEditOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDataModel | null>(null);

  const methods = useForm<FilterUserForm>({
    defaultValues: {
      name: '',
      cccd: '',
      active: undefined,
    },
  });

  const fetchData = useCallback(async (filters?: FilterUserForm) => {
    const res = await getAllUser(filters);
    setData(res);
  }, []);

  const onSubmit = (data: FilterUserForm) => {
    fetchData(data);
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

  const columns = useMemo(() => {
    return [
      ...USER_COLUMNS,
      ActionColumn<UserDataModel>({
        onEdit: (row) => {
          setSelectedUser(row);
          setEditOpen(true);
        },
        onDelete: handleDelete,
        getDeleteId: (row) => row.user_id,
        getDeleteLabel: (row) => row.fullname,
      }),
    ];
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <Box>

      <Typography variant="h6" gutterBottom>
        Quản lý người dùng
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        mb={2}
        alignItems="center"
        justifyContent="space-between"
      >

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            color="success"
            onClick={() => setCreateOpen(true)}
          >
            <AddCircleIcon />
          </Button>

          <Button
            variant="outlined"
            color="error"
            disabled={!selectedIds.length}
            onClick={() => {
              const selectedNames = data?.data
                ?.filter((user) => selectedIds.includes(user.user_id))
                .map((user) => user.fullname)
                .join(', ');

              if (confirm(`Bạn có chắc chắn muốn xóa: ${selectedNames}?`)) {
                handleDeleteMultiple();
              }
            }}
          >
            <DeleteIcon />
          </Button>

          <Button
            variant="outlined"
            color="primary"
            disabled={!selectedIds.length}
            onClick={() => setMultiEditOpen(true)}
          >
            <EditIcon />
          </Button>

        </Stack>
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              label="Tìm theo họ tên"
              {...methods.register('name')}
            />
            <TextField
              size="small"
              label="Tìm theo CCCD"
              {...methods.register('cccd')}
            />
            <select
              {...methods.register('active', {
                setValueAs: (v) => v === '' ? undefined : v === 'true',
              })}
            >
              <option value="">Tất cả</option>
              <option value="true">Hoạt động</option>
              <option value="false">Không hoạt động</option>
            </select>

            <SearchIconButtonStyle type="submit">
              <SearchIcon />
            </SearchIconButtonStyle>
          </Stack>
        </Form>

      </Stack>

      <DataGrid
        checkboxSelection
        disableRowSelectionOnClick
        rows={data?.data || []}
        columns={columns}
        rowCount={data?.meta.itemCount || 0}
        getRowId={(row) => row.user_id}
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        onRowSelectionModelChange={(model: GridRowSelectionModel) => {
          setSelectedIds(Array.from(model.ids) as number[]);
        }}
      />

      <CreateDialog
        open={createOpen}
        selectedIds={[]}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
      />

      <EditDialog
        open={editOpen}
        selectedId={selectedUser?.user_id || 0}
        onClose={() => setEditOpen(false)}
        onSave={handleEdit}
      />

      <EditMultiUserDialog
        open={multiEditOpen}
        selectedIds={selectedIds}
        onClose={() => setMultiEditOpen(false)}
        onSave={handleMultiEdit}
      />
    </Box>
  );
}
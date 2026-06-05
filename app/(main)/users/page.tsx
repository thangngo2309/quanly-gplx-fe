'use client';

import Box from '@mui/material/Box';

import { DataGrid, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid';

import {
  Button,
  Grid,
  MenuItem,
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
} from '@/api/user';

import { useMemo, useState, useEffect } from 'react';

import { USER_COLUMNS } from '@/constants/user-columns';
import { ActionColumn } from '@/component/data-grid/action-column';
import { CreateDialog } from '@/component/user/create-dialog.component';
import { EditDialog } from '@/component/user/edit-dialog.component';
import { EditMultiUserDialog } from '@/component/user/edit-multi-dialog.component';
import { SearchIconButtonStyle } from '@/style object/user-page.style';
import { FilterUserForm } from '@/model/user.model';

import {
  CreateUserModel,
  UpdateMultiUserModel,
  UpdateUserModel,
  UserDataModel,
} from '@/model/user.model';
import { toast } from 'react-toastify';
import { Form } from '@/component/form.component';
import { Controller, useForm } from 'react-hook-form';
import { DataGridStyle } from '@/style object/data-grid.style';

export default function UsersManagement() {

  const [data, setData] = useState<any>();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [multiEditOpen, setMultiEditOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDataModel | null>(null);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filter, setFilter] = useState<FilterUserForm>({
    name: '',
    cccd: '',
    active: undefined,
    sortBy: 'user_id',
    sortDirection: 'DESC',
  });

  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
    fetchData();
  }, [pagination, filter, sortModel])

  const methods = useForm<FilterUserForm>();

  const fetchData = async () => {
    const res = await getAllUser(
      {
        name: filter.name,
        cccd: filter.cccd,
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
    setFilter(formData);
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

            <Button
              variant="outlined"
              color="primary"
              disabled={!selectedIds.length}
              onClick={() => setMultiEditOpen(true)}
            >
              <EditIcon />
            </Button>

          </Stack>
        </ Grid>

        <Grid size="grow" display="flex" justifyContent="flex-end">
          <Form methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  size="small"
                  label="Tìm theo họ tên"
                  fullWidth
                  {...methods.register('name')}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  size="small"
                  label="Tìm theo CCCD"
                  fullWidth
                  {...methods.register('cccd')}
                />
              </Grid>
              <Grid size={{ xs: 10, sm: 3 }}>
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
                <SearchIconButtonStyle type="submit">
                  <SearchIcon />
                </SearchIconButtonStyle>
              </Grid>
            </Grid>
          </Form>
        </Grid>
      </Stack>

      <DataGridStyle>
        <DataGrid
          checkboxSelection
          disableRowSelectionOnClick
          columns={columns}
          rows={data?.data || []}
          rowCount={data?.meta?.itemCount || 0}
          pagination
          onPaginationModelChange={setPagination}
          paginationMode="server"
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          sortingMode="server"
          onSortModelChange={(model) => setSortModel(model)}
          getRowId={(row) => row.user_id}
          onRowSelectionModelChange={(model: GridRowSelectionModel) => {
            setSelectedIds(Array.from(model.ids) as number[]);
            if (model.type === 'exclude') {
              setSelectedIds(data?.data?.map((row: UserDataModel) => row.user_id) || []);
            }
          }}
        />
      </DataGridStyle>

      <CreateDialog
        open={createOpen}
        selectedIds={[]}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
      />

      {selectedUser && (
        <EditDialog
          open={editOpen}
          selectedId={selectedUser?.user_id || 0}
          onClose={() => setEditOpen(false)}
          onSave={handleEdit}
          data={selectedUser}
        />
      )}

      <EditMultiUserDialog
        open={multiEditOpen}
        selectedIds={selectedIds}
        onClose={() => setMultiEditOpen(false)}
        onSave={handleMultiEdit}
      />
    </Box>
  );
}
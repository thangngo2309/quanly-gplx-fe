'use client';

import Box from '@mui/material/Box';

import { GridSortModel } from '@mui/x-data-grid';

import {
  Button,
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
  createCar,
  deleteCar,
  deleteMultipleCar,
  getAllCar,
  updateCar,
  updateMultipleCar,
} from '@/api/car';

import { useEffect, useMemo, useState } from 'react';

import { CAR_COLUMNS } from '@/constants/car-columns';
import { ActionColumn } from '@/component/data-grid/action-column';
import { CreateDialog } from '@/component/car/create-dialog.component';
import { EditDialog } from '@/component/car/edit-dialog.component';
import { EditMultiCarDialog } from '@/component/car/edit-multi-dialog.component';
import { SearchIconButtonStyle } from '@/style object/user-page.style';
import { CarModel, FilterCarForm } from '@/model/car.model';

import {
  CreateCarModel,
  UpdateMultiCarModel,
  UpdateCarModel,
  CarDataModel,
} from '@/model/car.model';
import { toast } from 'react-toastify';
import { Form } from '@/component/form.component';
import { Controller, useForm } from 'react-hook-form';
import { Grid } from '@mui/system';
import Tooltip from '@mui/material/Tooltip';
import { CommonDataTable } from '@/component/data-grid/common-data-table.component';

export default function CarsManagement() {

  const [data, setData] = useState<CarModel | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [multiEditOpen, setMultiEditOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedCar, setSelectedCar] = useState<CarDataModel | null>(null);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filter, setFilter] = useState<FilterCarForm>({
    registrationNumber: '',
    imeiDat: '',
    active: undefined,
    sortBy: 'car_id',
    sortDirection: 'DESC',
  });

  const methods = useForm<FilterCarForm>();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [pagination, sortModel, filter]);

  const fetchData = async () => {
    const res = await getAllCar(
      {
        registrationNumber: filter.registrationNumber,
        imeiDat: filter.imeiDat,
        active: filter.active,
        sortBy: sortModel[0]?.field || filter.sortBy,
        sortDirection: sortModel[0]?.sort === 'asc' ? 'ASC' : 'DESC',
      },
      pagination.page + 1,
      pagination.pageSize
    );
    setData(res);
  };

  const onSubmit = (formData: FilterCarForm) => {
    setFilter(prev => ({
      ...prev,
      ...formData,
    }));
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const handleCreate = async (formData: CreateCarModel) => {
    await createCar(formData);
    setCreateOpen(false);
    fetchData();
    toast.success('Tạo xe thành công');
  };

  const handleEdit = async (formData: UpdateCarModel) => {
    if (!selectedCar) return;
    await updateCar(selectedCar.car_id, formData);
    setEditOpen(false);
    fetchData();
    toast.success('Cập nhật xe thành công');
  };

  const handleMultiEdit = async (CarIds: number[], formData: UpdateMultiCarModel) => {
    await updateMultipleCar(CarIds, formData);
    setMultiEditOpen(false);
    fetchData();
    toast.success('Cập nhật xe thành công');
  };

  const handleDelete = async (id: number) => {
    await deleteCar(id);
    fetchData();
    toast.success('Xóa xe thành công');
  };

  const handleDeleteMultiple = async () => {
    if (!selectedIds.length) return;
    await deleteMultipleCar(selectedIds);
    setSelectedIds([]);
    fetchData();
    toast.success('Xóa xe thành công');
  };

  const columns = useMemo(() => {
    return [
      ...CAR_COLUMNS,
      ActionColumn<CarDataModel>({
        onEdit: (row) => {
          setSelectedCar(row);
          setEditOpen(true);
        },
        onDelete: handleDelete,
        getDeleteId: (row) => row.car_id,
        getDeleteLabel: (row) => row.registrationNumber,
      }),
    ];
  }, []);

  return (
    <Box>

      <Typography variant="h6" gutterBottom>
        Quản lý xe tập lái
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
                    ?.filter((car: CarDataModel) => selectedIds.includes(car.car_id))
                    .map((car: CarDataModel) => car.registrationNumber)
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
        </Grid>

        <Grid size="grow" display="flex" justifyContent="flex-end">
          <Form methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  size="small"
                  label="Tìm theo biển số xe"
                  fullWidth
                  {...methods.register('registrationNumber')}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  size="small"
                  label="Tìm theo IMEI"
                  fullWidth
                  {...methods.register('imeiDat')}
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

      <CommonDataTable<CarDataModel>
        columns={columns}
        rows={data?.data || []}
        rowCount={data?.meta?.itemCount || 0}
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        getRowId={(row) => row.car_id}
        onSelectedIdsChange={setSelectedIds}
      />

      <CreateDialog
        open={createOpen}
        selectedIds={[]}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
      />

      <EditDialog
        open={editOpen}
        selectedId={selectedCar?.car_id || 0}
        onClose={() => setEditOpen(false)}
        onSave={handleEdit}
        data={selectedCar}
      />

      <EditMultiCarDialog
        open={multiEditOpen}
        selectedIds={selectedIds}
        onClose={() => setMultiEditOpen(false)}
        onSave={handleMultiEdit}
      />
    </Box>
  );
}
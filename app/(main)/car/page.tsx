'use client';

import Box from '@mui/material/Box';

import {
  DataGrid,
  GridRowSelectionModel,
  GridSortModel,
} from '@mui/x-data-grid';

import {
  Button,
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
import { DataGridStyle } from '@/style object/data-grid.style';

import {
  CreateCarModel,
  UpdateMultiCarModel,
  UpdateCarModel,
  CarDataModel,
} from '@/model/car.model';
import { toast } from 'react-toastify';
import { Form } from '@/component/form.component';
import { useForm } from 'react-hook-form';

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
    sortDirection: 'DESC',
  });

  const methods = useForm<FilterCarForm>();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [pagination, sortModel, filter]);

  const fetchData = async () => {    const res = await getAllCar(
      {
        registrationNumber: filter.registrationNumber,
        imeiDat: filter.imeiDat,
        active: filter.active,
        sortDirection: sortModel[0]?.sort === 'asc' ? 'ASC' : 'DESC',
      },
      pagination.page + 1,
      pagination.pageSize
    );
    setData(res);
  };

  const onSubmit = (formData: FilterCarForm) => {
    setFilter(formData);
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
              label="Tìm theo biển số xe"
              {...methods.register('registrationNumber')}
            />
            <TextField
              size="small"
              label="Tìm theo IMEI"
              {...methods.register('imeiDat')}
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

      <DataGridStyle>
        <DataGrid
          columnBufferPx={100}
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
          getRowId={(row) => row.car_id}
          onRowSelectionModelChange={(model: GridRowSelectionModel) => {
            setSelectedIds(Array.from(model.ids) as number[]);
            if (model.type === 'exclude') {
              setSelectedIds(data?.data?.map((row: CarDataModel) => row.car_id) || []);
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
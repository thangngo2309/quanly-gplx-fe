'use client';

import Box from '@mui/material/Box';
import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Grid } from '@mui/system';
import { CommonDataTable } from '@/component/data-grid/common-data-table.component';
import { VEHICLE_INSPECTION_COLUMNS } from '@/constants/vehicle-inspection-columns';
import { CreateVehicleInspectionModel, FilterVehicleInspection, UpdateVehicleInspectionModel, VehicleInspectionDataModel, VehicleInspectionModel } from '@/model/vehicle-inspection.model';
import { useEffect, useMemo, useState } from 'react';
import { createVehicleInspection, deleteVehicleInspection, getAllVehicleInspection, updateVehicleInspection } from '@/api/vehicle-inspection';
import { CarOption } from '@/model/vehicle-inspection-dialog-props';
import { GridSortModel } from '@mui/x-data-grid';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getAllCar } from '@/api/car';
import { CreateDialog } from '@/component/vehicle-inspection/create-dialog.component';
import { ActionColumn } from '@/component/data-grid/action-column';
import { Form } from '@/component/form.component';
import { SearchIconButtonStyle } from '@/style object/user-page.style';
import SearchIcon from '@mui/icons-material/Search';
import { EditDialog } from '@/component/vehicle-inspection/edit-dialog.component';

export default function VehicleInspectionManagement() {
    const [cars, setCars] = useState<CarOption[]>([]);
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedVehicleInspection, setSelectedVehicleInspection] = useState<VehicleInspectionDataModel | null>(null);
    const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [data, setData] = useState<VehicleInspectionModel | null>(null);
    const [filter, setFilter] = useState<FilterVehicleInspection>({
        registration_number: '',
        is_active: undefined
    });

    const methods = useForm<FilterVehicleInspection>();

    const handleSortModelChange = (model: GridSortModel) => {
        setSortModel(model);
        setPagination(prev => ({ ...prev, page: 0 }));
    };

    const fetchCars = async () => {
        const res = await getAllCar({
            active: true,
        });
        setCars(res?.data || []);
    }

    const fetchData = async () => {
        const res = await getAllVehicleInspection(
            {
                ...filter,
                sort_by: sortModel[0]?.field,
                sort_direction: sortModel[0]?.sort === 'asc' ? 'ASC' : 'DESC',
            },
            pagination.page + 1,
            pagination.pageSize
        );
        setData(res);
    }

    useEffect(() => {
        fetchData();
        fetchCars();
    }, []);

    useEffect(() => {
        fetchData();
    }, [pagination, filter]);

    const handleCreate = async (formData: CreateVehicleInspectionModel) => {
        await createVehicleInspection(formData);
        setCreateOpen(false);
        fetchData();
        toast.success('Tạo đăng kiểm xe thành công');
    }

    const handleEdit = async (formData: UpdateVehicleInspectionModel) => {
        await updateVehicleInspection(selectedVehicleInspection?.vehicle_inspection_id || 0, formData);
        setEditOpen(false);
        fetchData();
        toast.success('Cập nhật đăng kiểm xe thành công');
    }

    const handleDelete = async (id: number) => {
        await deleteVehicleInspection(id);
        fetchData();
        toast.success('Xóa đăng kiểm thành công');
    };

    const onSubmit = (formData: FilterVehicleInspection) => {
        setFilter(prev => ({ ...prev, ...formData }));
        setPagination(prev => ({ ...prev, page: 0 }));
    };

    const columns = useMemo(() => {
        return [
            ...VEHICLE_INSPECTION_COLUMNS,
            ActionColumn<VehicleInspectionDataModel>({
                onEdit: (row) => {
                    setSelectedVehicleInspection(row);
                    setEditOpen(true);
                },
                onDelete: handleDelete,
                getDeleteId: (row) => row.vehicle_inspection_id,
                getDeleteLabel: (row) => row.car.registrationNumber,
                isHidden: (row) => row.car.isActive === false || row.car.isDelete === true,
            }),
        ];
    }, []);

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Lịch sử đăng kiểm xe</Typography>

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
                            <Button variant="outlined" color="success" onClick={() => setCreateOpen(true)}>
                                <AddCircleIcon />
                            </Button>
                        </Tooltip>
                    </Stack>
                </Grid>

                <Grid size="grow" display="flex" justifyContent="flex-end">
                    <Form methods={methods} onSubmit={onSubmit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    size="small"
                                    label="Tìm theo biển số xe"
                                    fullWidth
                                    {...methods.register('registration_number')}
                                />
                            </Grid>

                            <Grid size={{ xs: 10, sm: 4 }}>
                                <Controller
                                    name="is_active"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <TextField
                                            select
                                            label="Trạng thái"
                                            size="small"
                                            fullWidth
                                            value={field.value === undefined ? 'all' : String(field.value)}
                                            onChange={(e) => field.onChange(e.target.value === 'all' ? undefined : e.target.value === 'true')}
                                        >
                                            <MenuItem value="all">Tất cả</MenuItem>
                                            <MenuItem value="true">Hoạt động</MenuItem>
                                            <MenuItem value="false">Không hoạt động</MenuItem>
                                        </TextField>
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 2, sm: 2 }}>
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

            <CommonDataTable<VehicleInspectionDataModel>
                columns={columns}
                rows={data?.data || []}
                rowCount={data?.meta?.itemCount || 0}
                getRowId={(row) => row.vehicle_inspection_id}
                paginationModel={pagination}
                onPaginationModelChange={setPagination}
                sortModel={sortModel}
                onSortModelChange={handleSortModelChange}
                checkboxSelection={false}
            />

            <CreateDialog
                open={createOpen}
                cars={cars}
                onClose={() => setCreateOpen(false)}
                onSave={handleCreate}
            />

            <EditDialog
                open={editOpen}
                cars={cars}
                onClose={() => setEditOpen(false)}
                onSave={handleEdit}
                data={selectedVehicleInspection}
            />
        </Box>
    );
}
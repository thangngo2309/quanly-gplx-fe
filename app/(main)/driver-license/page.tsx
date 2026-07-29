'use client';

import Box from '@mui/material/Box';
import { GridSortModel, GridRowSelectionModel } from '@mui/x-data-grid';
import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import { Grid } from '@mui/system';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import {
    createDriverLicense,
    deleteDriverLicense,
    deleteMultipleDriverLicense,
    getAllDriverLicense,
    updateDriverLicense,
    updateMultipleDriverLicense,
} from '@/api/driver-license';
import { getAllUser } from '@/api/user';

import { DRIVER_LICENSE_COLUMNS } from '@/constants/driver-license-columns';
import { ActionColumn } from '@/component/data-grid/action-column';
import { CreateDialog } from '@/component/driver-license/create-dialog.component';
import { EditDialog } from '@/component/driver-license/edit-dialog.component';
import { EditMultiDriverLicenseDialog } from '@/component/driver-license/edit-multi-dialog.component';
import { CommonDataTable } from '@/component/data-grid/common-data-table.component';
import { Form } from '@/component/form.component';
import { SearchIconButtonStyle } from '@/style object/user-page.style';

import {
    DriverLicenseModel,
    DriverLicenseDataModel,
    CreateDriverLicenseModel,
    UpdateDriverLicenseModel,
    UpdateMultiDriverLicenseModel,
    FilterDriverLicense,
} from '@/model/driver-license.model';
import { RenewDrivingLicenseButton } from '@/component/driver-license/driver-license-action.component';
import { RenewDriverLicenseDialog } from '@/component/driver-license/renew-dialog.component';
import { UserOption } from '@/model/driver-license-dialog-props';
import { EmailSendStatus } from '@/constants/email-send-status';
export default function DriverLicenseManagement() {
    const [data, setData] = useState<DriverLicenseModel | null>(null);
    const [users, setUsers] = useState<UserOption[]>([]);
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [multiEditOpen, setMultiEditOpen] = useState(false);
    const [renewOpen, setRenewOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectedLicense, setSelectedLicense] = useState<DriverLicenseDataModel | null>(null);
    const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [filter, setFilter] = useState<FilterDriverLicense>({
        license_number: '',
        fullname: '',
        active: undefined,
        sortBy: 'driver_license_id',
        sortDirection: 'DESC',
    });
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
        type: 'include',
        ids: new Set(),
    });

    const methods = useForm<FilterDriverLicense>();

    const fetchUsers = async () => {
        try {
            const res = await getAllUser({
                active: true,
            });
            if (res && res.data) {
                setUsers(res.data);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tải danh sách người dùng');
        }
    };

    useEffect(() => {
        fetchData();
        fetchUsers();
    }, []);

    useEffect(() => {
        fetchData();
    }, [pagination, sortModel, filter]);

    useEffect(() => {
        setRowSelectionModel({
            type: 'include',
            ids: new Set(),
        });

        setSelectedIds([]);
    }, [pagination.page]);

    const fetchData = async () => {
        const res = await getAllDriverLicense(
            {
                license_number: filter.license_number,
                fullname: filter.fullname,
                active: filter.active,
                sortBy: sortModel[0]?.field || filter.sortBy,
                sortDirection: sortModel[0]
                    ? sortModel[0].sort === 'desc'
                        ? 'DESC'
                        : 'ASC'
                    : filter.sortDirection,
            },
            pagination.page + 1,
            pagination.pageSize
        );
        setData(res);
    };

    const onSubmit = (formData: FilterDriverLicense) => {
        setFilter(prev => ({ ...prev, ...formData }));
        setPagination(prev => ({ ...prev, page: 0 }));
    };

    const handleCreate = async (formData: CreateDriverLicenseModel) => {
        await createDriverLicense(formData);
        setCreateOpen(false);
        fetchData();
        toast.success('Tạo giấy phép lái xe thành công');
    };

    const handleEdit = async (formData: UpdateDriverLicenseModel) => {
        if (!selectedLicense) return;
        await updateDriverLicense(selectedLicense.driver_license_id, formData);
        setEditOpen(false);
        fetchData();
        toast.success('Cập nhật giấy phép lái xe thành công');
    };

    const handleMultiEdit = async (ids: number[], formData: UpdateMultiDriverLicenseModel) => {
        await updateMultipleDriverLicense(ids, formData);
        setMultiEditOpen(false);
        fetchData();
        toast.success('Cập nhật giấy phép lái xe thành công');
    };

    const handleDelete = async (id: number) => {
        await deleteDriverLicense(id);
        fetchData();
        toast.success('Xóa giấy phép lái xe thành công');
    };

    const handleDeleteMultiple = async () => {
        if (!selectedIds.length) return;
        await deleteMultipleDriverLicense(selectedIds);
        fetchData();
        toast.success('Xóa giấy phép lái xe thành công');
    };

    const handleRenew = async (formData: UpdateDriverLicenseModel) => {
        if (!selectedLicense) return;
        await updateDriverLicense(selectedLicense.driver_license_id, formData);
        setRenewOpen(false);
        fetchData();
        toast.success('Gia hạn giấy phép lái xe thành công');
    };
    const columns = useMemo(() => [
        ...DRIVER_LICENSE_COLUMNS,
        ActionColumn<DriverLicenseDataModel>({
            onEdit: (row) => {
                setSelectedLicense(row);
                setEditOpen(true);
            },
            onDelete: handleDelete,
            getDeleteId: (row) => row.driver_license_id,
            getDeleteLabel: (row) => row.license_number,
            isHidden: (row) => !row.user.is_active || row.user.is_deleted || row.email_send_status === EmailSendStatus.FAILED || row.email_send_status === EmailSendStatus.QUEUED,
            customAction: (row) => (
                <RenewDrivingLicenseButton
                    driver_license={row}
                    onRenew={(row) => {
                        setSelectedLicense(row);
                        setRenewOpen(true);
                    }}
                />
            ),
        }),
    ], []);

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Quản lý giấy phép lái xe
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
                            <Button variant="outlined" color="success" onClick={() => setCreateOpen(true)}>
                                <AddCircleIcon />
                            </Button>
                        </Tooltip>

                        <Tooltip title="Xóa hàng loạt">
                            <Button
                                variant="outlined"
                                color="error"
                                disabled={!selectedIds.length}
                                onClick={() => {
                                    const selectedNumbers = data?.data
                                        ?.filter((item: DriverLicenseDataModel) => selectedIds.includes(item.driver_license_id))
                                        .map((item: DriverLicenseDataModel) => item.license_number)
                                        .join(', ');

                                    if (confirm(`Bạn có chắc chắn muốn xóa: ${selectedNumbers}?`)) {
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
                                    label="Tìm theo số GPLX"
                                    fullWidth
                                    {...methods.register('license_number')}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    size="small"
                                    label="Tìm theo họ tên"
                                    fullWidth
                                    {...methods.register('fullname')}
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
                                            value={field.value === undefined ? 'all' : String(field.value)}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value === 'all'
                                                        ? undefined
                                                        : e.target.value === 'true'
                                                )
                                            }
                                        >
                                            <MenuItem value="all">Tất cả</MenuItem>
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

            <CommonDataTable<DriverLicenseDataModel>
                columns={columns}
                rows={data?.data || []}
                rowCount={data?.meta?.itemCount || 0}
                paginationModel={pagination}
                onPaginationModelChange={setPagination}
                sortModel={sortModel}
                onSortModelChange={setSortModel}
                getRowId={(row) => row.driver_license_id}
                rowSelectionModel={rowSelectionModel}
                onRowSelectionModelChange={setRowSelectionModel}
                onSelectedIdsChange={setSelectedIds}
                isRowSelectable={(params) =>
                    params.row.user.is_active && !params.row.user.is_deleted &&
                    (params.row.email_send_status === EmailSendStatus.SUCCESS || params.row.email_send_status === EmailSendStatus.PENDING)}
            />

            <CreateDialog
                open={createOpen}
                users={users}
                onClose={() => setCreateOpen(false)}
                onSave={handleCreate}
            />

            <RenewDriverLicenseDialog
                open={renewOpen}
                onClose={() => setRenewOpen(false)}
                onSave={handleRenew}
                data={selectedLicense}
            />

            <EditDialog
                open={editOpen}
                users={users}
                onClose={() => setEditOpen(false)}
                onSave={handleEdit}
                data={selectedLicense}
            />

            <EditMultiDriverLicenseDialog
                open={multiEditOpen}
                selectedIds={selectedIds}
                onClose={() => setMultiEditOpen(false)}
                onSave={handleMultiEdit}
            />
        </Box>
    );
}
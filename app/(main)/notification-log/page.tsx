'use client';

import { getAllNotificationLog, retryNotificationLog } from "@/api/notification-log";
import { CommonDataTable } from "@/component/data-grid/common-data-table.component";
import { NotificationType, ReferenceType, SendStatus } from "@/constants/notification-log";
import { FilterNotificationLog, NotificationLogDataModel, NotificationLogModel } from "@/model/notification-log.model";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SearchIcon from '@mui/icons-material/Search';
import ReplayIcon from '@mui/icons-material/Replay';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Form } from '@/component/form.component';
import { Controller, useForm } from 'react-hook-form';
import dayjs from "dayjs";
import { toUTC7 } from "@/utils/format-date";
import { styles } from "@/style object/sx.style";

export default function NotificationLogPage() {
    const [data, setData] = useState<NotificationLogModel | null>(null);
    const [retryingId, setRetryingId] = useState<number | null>(null);
    const [selectedNotificationLog, setSelectedNotificationLog] = useState<NotificationLogDataModel | null>(null);
    const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [filter, setFilter] = useState<FilterNotificationLog>({
        reference_type: undefined,
        notification_type: undefined,
        send_status: undefined,
        recipient: '',
        fullname: '',
    });

    const methods = useForm<FilterNotificationLog>({
        defaultValues: filter,
    });

    const onSubmit = (formValues: FilterNotificationLog) => {
        setPagination((prev) => ({ ...prev, page: 0 }));
        setFilter({
            reference_type: formValues.reference_type,
            notification_type: formValues.notification_type,
            send_status: formValues.send_status,
            recipient: formValues.recipient,
            fullname: formValues.fullname,
        });
    };

    const fetchData = async () => {
        const res = await getAllNotificationLog(
            {
                reference_type: filter.reference_type,
                notification_type: filter.notification_type,
                send_status: filter.send_status,
                recipient: filter.recipient,
                fullname: filter.fullname,
            },
            pagination.page + 1,
            pagination.pageSize
        );
        setData(res);
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [pagination, sortModel, filter]);

    const handleRetry = async (row: NotificationLogDataModel) => {
        try {
            setRetryingId(row.notification_log_id);
            await retryNotificationLog(row.reference_id);
            toast.success('Đã gửi lại thông báo');
            await fetchData();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi gửi lại thông báo');
        }
    };

    const checkExpired = (expiryDate: string) => {
        if (!expiryDate) return false;
        return dayjs(expiryDate).isBefore(dayjs(), 'day');
    };

    const columns: GridColDef[] = [
        { field: 'reference_type', headerName: 'Loại dữ liệu', width: 160 },
        { field: 'notification_type', headerName: 'Loại thông báo', width: 160 },
        { field: 'reference_id', headerName: 'ID tham chiếu', width: 160 },
        {
            field: 'u.fullname',
            headerName: 'Họ và tên',
            width: 160,
            valueGetter: (value, row) => row.user?.fullname || '',
        },
        { field: 'recipient', headerName: 'Nơi nhận', width: 160 },
        { field: 'sent_at', 
            headerName: 'Thời gian gửi', 
            width: 160, 
            flex: 1,
            renderCell: (params) => toUTC7(params.value),
         },
        {
            field: 'send_status',
            headerName: 'Trạng thái',
            width: 180,
            type: 'boolean',
            align: 'left',
            headerAlign: 'left',
            renderCell: ({ value }) => {
                switch (value) {
                    case SendStatus.QUEUED:
                        return (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <PriorityHighIcon color="warning" fontSize="small" />
                                <Typography variant="body2" color="warning.main">
                                    Đang chờ
                                </Typography>
                            </Stack>
                        );
                    case SendStatus.SUCCESS:
                        return (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CheckIcon color="success" fontSize="small" />
                                <Typography variant="body2" color="success.main">
                                    Hoàn thành
                                </Typography>
                            </Stack>
                        );
                    case SendStatus.FAILED:
                        return (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CloseIcon color="error" fontSize="small" />
                                <Typography variant="body2" color="error.main">
                                    Thất bại
                                </Typography>
                            </Stack>
                        );
                    default:
                        return value;
                }
            },
        },
        {
            field: 'error_message',
            headerName: 'Lý do lỗi',
            width: 120,
            sortable: false,
            renderCell: (params) => {
                if (params.row.send_status !== SendStatus.FAILED || !params.row.error_message) {
                    return null;
                }
                return (
                    <Button
                        size="small"
                        variant="text"
                        onClick={() => setSelectedNotificationLog(params.row)}
                    >
                        Hiển thị
                    </Button>
                );
            },
        },
        { field: 'retry_count', headerName: 'Lần gửi', width: 120 },
        {
            field: 'actions',
            headerName: 'Thao tác',
            width: 100,
            sortable: false,
            renderCell: (params) => {
                if (params.row.send_status === SendStatus.FAILED && !checkExpired(params.row.expiry_date) && params.row.can_retry) {
                    return (
                        <Tooltip title="Gửi lại">
                            <IconButton
                                size="small"
                                onClick={() => handleRetry(params.row)}
                                disabled={retryingId === params.row.notification_log_id}
                                color="primary"
                            >
                                <ReplayIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    );
                }
                return null;
            },
        },
    ];

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Lịch sử thông báo
            </Typography>

            <Grid
                container
                spacing={2}
                mb={2}
                alignItems={{ xs: 'stretch', lg: 'center' }}
                justifyContent="space-between"
            >
                <Grid size={{ xs: 12, sm: 5 }}></Grid>
                <Grid size={{ xs: 12, sm: 7 }}>
                    <Form methods={methods} onSubmit={onSubmit} sx={styles.searchForm}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                <Controller
                                    name="fullname"
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
                                    name="recipient"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            value={field.value ?? ''}
                                            size="small"
                                            label="Nơi nhận"
                                            fullWidth
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                <Controller
                                    name="notification_type"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <InputLabel id="notification-type-label">Loại thông báo</InputLabel>
                                            <Select
                                                labelId="notification-type-label"
                                                size="small"
                                                label="Loại thông báo"
                                                fullWidth
                                                value={field.value ?? 'empty'}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value === 'empty' ? undefined : e.target.value
                                                    )
                                                }
                                            >
                                                <MenuItem value="empty">Tất cả</MenuItem>
                                                {NotificationType.map((value) => (
                                                    <MenuItem key={value} value={value}>{value}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                <Controller
                                    name="reference_type"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <InputLabel id="reference-type-label">Loại dữ liệu</InputLabel>
                                            <Select
                                                labelId="reference-type-label"
                                                size="small"
                                                label="Loại dữ liệu"
                                                fullWidth
                                                value={field.value ?? 'empty'}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value === 'empty' ? undefined : e.target.value
                                                    )
                                                }
                                            >
                                                <MenuItem value="empty">Tất cả</MenuItem>
                                                {ReferenceType.map((value) => (
                                                    <MenuItem key={value} value={value}>{value}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                <Controller
                                    name="send_status"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <InputLabel id="send-status-label">Trạng thái</InputLabel>
                                            <Select
                                                labelId="send-status-label"
                                                size="small"
                                                label="Trạng thái"
                                                fullWidth
                                                value={field.value ?? 'empty'}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value === 'empty' ? undefined : e.target.value
                                                    )
                                                }
                                            >
                                                <MenuItem value="empty">Tất cả</MenuItem>
                                                {Object.values(SendStatus).map((status) => (
                                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                <Tooltip title="Tìm kiếm">
                                    <Button variant="outlined" type="submit" fullWidth sx={[styles.minWidthSearchButton, styles.minHeightButton]}>
                                        <SearchIcon />
                                    </Button>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Form>
                </Grid>
            </Grid>
            <CommonDataTable<NotificationLogDataModel>
                columns={columns}
                rows={data?.data || []}
                rowCount={data?.meta?.itemCount || 0}
                paginationModel={pagination}
                onPaginationModelChange={setPagination}
                sortModel={sortModel}
                onSortModelChange={setSortModel}
                getRowId={(row) => row.notification_log_id}
                checkboxSelection={false}
            />

            <Dialog
                open={!!selectedNotificationLog}
                onClose={() => setSelectedNotificationLog(null)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Chi tiết lỗi gửi thông báo</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body1" color="text.secondary">
                                ID:
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {selectedNotificationLog?.notification_log_id}
                            </Typography>
                        </Stack>

                        <Stack spacing={1}>
                            <Typography variant="body1" color="text.secondary">
                                Thông báo lỗi:
                            </Typography>
                            <Typography variant="body1" fontWeight="medium" color="error">
                                {selectedNotificationLog?.error_message}
                            </Typography>
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedNotificationLog(null)}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
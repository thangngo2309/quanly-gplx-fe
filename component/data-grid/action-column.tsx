import { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { ActionHandlers } from "@/model/grid-data/action-handlers";
import Tooltip from '@mui/material/Tooltip';

export const ActionColumn = <T,>({
    onEdit,
    onDelete,
    getDeleteId,
    getDeleteLabel,
    customAction,
    isHidden
}: ActionHandlers<T>): GridColDef => {
    return {
        field: "actions",
        headerName: "Thao tác",
        width: 150,
        sortable: false,
        align: "center",
        renderCell: (params) => {
            const row = params.row as T;
            if (isHidden?.(params.row)) return null;

            return (
                <>
                    {onEdit && (
                        <Tooltip title="Chỉnh sửa">
                            <IconButton color="primary" onClick={() => onEdit(row)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    )}

                    {onDelete && (
                        <Tooltip title="Xóa">
                            <IconButton
                                color="error"
                                onClick={() => {
                                    const label = getDeleteLabel?.(row);
                                    const id = getDeleteId?.(row);
                                    if (
                                        id !== undefined &&
                                        confirm(
                                            `Bạn có chắc chắn muốn xóa ${label}?`
                                        )
                                    ) {
                                        onDelete(id);
                                    }
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )}

                    {customAction?.(row)}

                </>
            );
        },
    };
};
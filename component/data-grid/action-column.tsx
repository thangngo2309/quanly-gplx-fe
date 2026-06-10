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
}: ActionHandlers<T>): GridColDef => {
    return {
        field: "actions",
        type: "actions",
        headerName: "Thao tác",
        width: 120,
        getActions: (params) => {
            const row = params.row as T;
            const actions = [];

            if (onEdit) {
                actions.push(
                    <Tooltip title="Chỉnh sửa">
                        <IconButton color="primary" onClick={() => onEdit(row)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                );
            }

            if (onDelete) {
                actions.push(
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
                );
            }

            return actions;
        },
    };
};
import { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { ActionHandlers } from "@/model/grid-data/action-handlers";

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
                    <IconButton color="primary" onClick={() => onEdit(row)}>
                        <EditIcon />
                    </IconButton>
                );
            }

            if (onDelete) {
                actions.push(
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
                );
            }

            return actions;
        },
    };
};
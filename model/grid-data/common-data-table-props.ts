import { DataGridProps, GridRowId } from "@mui/x-data-grid";

export interface CommonDataTableProps<T>
    extends Omit<DataGridProps, 'rows' | 'getRowId'> {
    rows: T[];
    getRowId: (row: T) => GridRowId;
    onSelectedIdsChange?: (ids: number[]) => void;
}
'use client';

import { DataGrid } from '@mui/x-data-grid';
import { DataGridStyle } from '@/style object/data-grid.style';
import { CommonDataTableProps } from '@/model/grid-data/common-data-table-props';

export function CommonDataTable<T>({
    rows,
    getRowId,
    onSelectedIdsChange,
    ...props
}: CommonDataTableProps<T>) {
    return (
        <DataGridStyle>
            <DataGrid
                columnBufferPx={100}
                checkboxSelection
                disableRowSelectionOnClick
                pagination
                paginationMode="server"
                sortingMode="server"
                pageSizeOptions={[10, 25, 50]}
                initialState={{
                    pagination: {
                        paginationModel: {
                            page: 0,
                            pageSize: 10
                        },
                    },
                }}
                rows={rows}
                getRowId={getRowId}
                {...props}
                onRowSelectionModelChange={(model) => {
                    let ids: number[];

                    if (model.type === 'exclude') {
                        ids = rows.map(row => getRowId(row) as number).filter(id => !model.ids.has(id));
                    } else {
                        ids = Array.from(model.ids) as number[];
                    }
                    onSelectedIdsChange?.(ids);
                }}
            />
        </DataGridStyle>
    );
}
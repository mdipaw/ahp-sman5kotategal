export type TypeTableData<T extends object> = T & { id: string };
export interface TableProps<T extends object> {
    data: TypeTableData<T>[];
    columns: Array<{ title: string; key: string }>;
    rowsPerPageOptions?: number[];
    onRowSelect?: (selectedRows: string[]) => void;
    onDelete?: (selectedRows:string[]) => void;
    onEdit?: (t: TypeTableData<T>) => void;
    onAdd?: () => void;
    currentPage?: number;
    rowsPerPage?: 5 | 10 | 20;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    onRowsPerPageChange?: (rows: number) => void;
    skipValueOnData?: string[],
}
export type TypeTableData<T extends object> = T & { id: number };
export interface TableProps<T extends object> {
    data: T[];
    columns: Array<{ title: string; key: string }>;
    rowsPerPageOptions?: number[];
    onRowSelect?: (selectedRows: number[]) => void;
    onDelete?: (selectedRows:number[]) => void;
    onEdit?: (t: T) => void;
    onAdd?: () => void;
    currentPage?: number;
    rowsPerPage?: 5 | 10 | 20;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    onRowsPerPageChange?: (rows: number) => void;
    skipValueOnData?: string[],
}
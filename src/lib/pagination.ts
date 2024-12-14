export const handleRowsPerPageChange = (
    rows: number,
    setRowsPerPage: (rows: number) => void,
    setCurrentPage: (rows: number) => void,
    fetchData: (page: number, limit: number) => void,
) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
    fetchData(1, rows);
};

export const handlePageChange = (page: number, setCurrentPage:(page: number)=> void) => {
    setCurrentPage(page);
};
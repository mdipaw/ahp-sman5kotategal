/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';

export interface TableProps<T extends { id: string }> {
    data: T[];
    columns: Array<{
        title: string;
        key: string;
    }>;
    rowsPerPageOptions?: number[];
    onRowSelect?: (selectedRows: string[]) => void;
    onDelete?: () => Promise<void>;
    onEdit?: (row: T) => void;
    onAdd?: () => void;
};

const Table =<T extends { id: string }> ({
                   columns,
                   data,
                   rowsPerPageOptions = [5, 10, 20],
                   onRowSelect,
                   onDelete,
                   onEdit,
                   onAdd,
               }: TableProps<T>) => {
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

    const totalPages = Math.ceil(data.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;

    const handleCheckboxChange = (id: string) => {
        const newSelectedRows = selectedRows.includes(id)
            ? selectedRows.filter((rowId) => rowId !== id)
            : [...selectedRows, id];

        setSelectedRows(newSelectedRows);

        if (onRowSelect) {
            onRowSelect(newSelectedRows);
        }
    };

    const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allKeys = data.map((row) => row.id);
            setSelectedRows(allKeys);
        } else {
            setSelectedRows([]);
        }
    };

    return (
        <div className="p-4">
            {/* Buttons */}
            <div className="flex justify-end space-x-4 mb-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => onAdd?.()}
                >
                    Tambah
                </button>
                <button
                    className={`ml-2 px-4 py-2 rounded ${
                        selectedRows.length > 0
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={selectedRows.length === 0}
                    onClick={onDelete}
                >
                    Delete Partner
                </button>
            </div>

            {/* Table */}
            <table className="min-w-full border border-gray-300">
                <thead>
                <tr className="bg-gray-100">
                    <th className="p-2 border border-gray-300">
                        <input
                            type="checkbox"
                            onChange={handleSelectAllChange}
                            checked={selectedRows.length === data.length && selectedRows.length > 0}
                        />
                    </th>
                    {columns.map((col) => (
                        <th key={col.key} className="p-2 border border-gray-300">
                            {col.title}
                        </th>
                    ))}
                    <th className="p-2 border border-gray-300 w-[100px]">Actions</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                        <td className="p-2 border border-gray-300 text-center">
                            <input
                                type="checkbox"
                                checked={selectedRows.includes(row.id)}
                                onChange={() => handleCheckboxChange(row.id)}
                            />
                        </td>
                        {Object.entries(row).map(([key, value]) => {
                            if (key === 'id') {
                                return null

                            }
                            return (
                                <td key={key} className="p-2 border border-gray-300 text-center">
                                    {value}
                                </td>
                            );
                        })}
                        <td className="p-2 border border-gray-300 text-center">
                            <button
                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                onClick={() => onEdit?.(row)}
                            >
                                Edit
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-end items-center mt-4">
                <div className="flex items-center space-x-4">
                    <div className="text-sm">
                        Rows per page
                        <select
                            value={rowsPerPage}
                            onChange={(e) => setRowsPerPage(Number(e.target.value))}
                            className="ml-2 border border-gray-300 rounded px-2 py-1"
                        >
                            {rowsPerPageOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="text-sm">
                        {startIndex + 1}-{Math.min(startIndex + rowsPerPage, data.length)} of {data.length}
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            className={`px-2 py-1 text-sm rounded ${
                                currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-blue-500'
                            }`}
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        >
                            {'<<'}
                        </button>
                        <button
                            className={`px-2 py-1 text-sm rounded ${
                                currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-blue-500'
                            }`}
                            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            {'<'}
                        </button>

                        <span className="text-sm text-gray-700">{currentPage}</span>

                        <button
                            className={`px-2 py-1 text-sm rounded ${
                                currentPage === totalPages
                                    ? 'text-gray-500 cursor-not-allowed'
                                    : 'text-blue-500'
                            }`}
                            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            {'>'}
                        </button>
                        <button
                            className={`px-2 py-1 text-sm rounded ${
                                currentPage === totalPages
                                    ? 'text-gray-500 cursor-not-allowed'
                                    : 'text-blue-500'
                            }`}
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            {'>>'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table;

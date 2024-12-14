import React, {useEffect, useState} from 'react';
import {NavBar, Footer} from "@/components";
import {GetServerSideProps} from "next";
import {getUser} from "@/lib/auth";
import {Kriteria, User} from "@/types/api";
import Table from "@/components/Table";
import EditForm from "@/components/PopupForm";
import AddForm from "@/components/PopupForm";
import {TypeTableData} from "@/types/table.types";
import {handlePageChange, handleRowsPerPageChange} from "@/lib/pagination";
import {useNotification} from "@/context/NotificationContext";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const [user, backToLogin] = await getUser(context);
    if (backToLogin) {
        return backToLogin;
    }
    return {
        props: {
            user,
        },
    };
};

const KriteriaPage = ({user}: { user: User }) => {
    const {setErrorMessage} = useNotification();
    const [kriteriaList, setKriteriaList] = useState<TypeTableData<Kriteria>[]>([]);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [selectedKriteria, setSelectedKriteria] = useState<TypeTableData<Kriteria> | null>(null);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalRecords, setTotalRecords] = useState(0); // New state to store total records count
    const [init, setInit] = useState<boolean>(false);

    const handleEditSubmit = async (updatedData: string[]) => {
        if (selectedKriteria) {
            const response = await fetch("/api/data", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: 'kriteria',
                    id: selectedKriteria.id,
                    nama: updatedData[1],
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                setErrorMessage(data.error);
                return
            }
            setKriteriaList((prevList) =>
                prevList.map((kriteria) =>
                    kriteria.id === selectedKriteria.id
                        ? {...kriteria, nama_kriteria: updatedData[1]}
                        : kriteria
                )
            );

            setIsAddFormOpen(false);
        }
        setIsEditFormOpen(false);
        setSelectedKriteria(null);
    };

    const handleAddSubmit = async (newData: string[]) => {
        const [idKriteria, namaKriteria] = newData;
        const response = await fetch("/api/data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: 'kriteria',
                id: idKriteria,
                nama: namaKriteria,
            }),
        });
        if (!response.ok) {
            const data = await response.json();
            setErrorMessage(data.error);
            return
        }
        setKriteriaList((prevList) => [
            ...prevList,
            {
                id: idKriteria,
                nama_kriteria: namaKriteria,
                bobot_kriteria: 0,
                jumlah_kriteria: 0,
                id_kriteria: idKriteria
            },
        ]);
        setIsAddFormOpen(false);

    };

    const fetchData = async (page: number, limit: number) => {
        if (totalRecords <= rowsPerPage && init) return
        const offset = (page - 1) * limit;
        const [responseData, responseCount] = await Promise.all([
            fetch(`/api/data?type=kriteria&limit=${limit}&offset=${offset}`),
            fetch(`/api/data?type=count&type_count=kriteria`)
        ])

        if (responseData.ok) {
            const data = await responseData.json() as Kriteria[];
            setKriteriaList(data.map((k) => ({...k, id: k.id_kriteria})));
        }

        if (responseCount.ok) {
            const countData = await responseCount.json() as { total: number }[];
            setTotalRecords(countData[0].total);
            setInit(true)
        }
    };

    const handleDelete = async (selectedRows: string[]) => {
            const values = selectedRows.join(',');
            const response = await fetch(`/api/data?type=kriteria&ids=${values}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const data = await response.json();
                setErrorMessage(data.error);
                return;
            }
            setKriteriaList((prevList) =>
                prevList.filter((kriteria) => !selectedRows.includes(kriteria.id))
            );
           setSelectedRows([])
    };

    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    useEffect(() => {
        fetchData(currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage]);

    return (
        <>
            <NavBar user={user}/>
            <div className="p-4">
                <Table
                    columns={[
                        {title: 'ID Kriteria', key: 'id_kriteria'},
                        {title: 'Nama Kriteria', key: 'nama'},
                        {title: "Jumlah", key: 'jumlah'},
                        {title: 'Bobot', key: 'bobot'},
                    ]}
                    data={kriteriaList}
                    onRowSelect={(selectedRows) => setSelectedRows(selectedRows)}
                    onEdit={(kriteria: TypeTableData<Kriteria & {
                        id: string
                    }>) => (setSelectedKriteria(kriteria), setIsEditFormOpen(true))}
                    onDelete={handleDelete}
                    onAdd={() => setIsAddFormOpen(true)}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage as 5}
                    totalPages={totalPages}
                    onPageChange={(page) => handlePageChange(page, setCurrentPage)}
                    onRowsPerPageChange={(rows) => handleRowsPerPageChange(rows, setRowsPerPage, setCurrentPage, fetchData)}
                />

                {selectedKriteria && (
                    <EditForm
                        title="Edit Kriteria"
                        isOpen={isEditFormOpen}
                        onClose={() => setIsEditFormOpen(false)}
                        onSubmit={handleEditSubmit}
                        inputs={[
                            {label: "ID Kriteria", defaultValue: selectedKriteria.id_kriteria, disabled: true},
                            {label: 'Nama Kriteria', defaultValue: selectedKriteria.nama_kriteria},
                        ]}
                    />
                )}

                <AddForm
                    title="Tambah Kriteria"
                    isOpen={isAddFormOpen}
                    onClose={() => setIsAddFormOpen(false)}
                    onSubmit={handleAddSubmit}
                    inputs={[
                        {label: 'ID Kriteria', defaultValue: ''},
                        {label: 'Nama Kriteria', defaultValue: ''},
                    ]}
                />
            </div>
            <Footer/>
        </>
    );
};

export default KriteriaPage;

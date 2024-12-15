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
import {router} from "next/client";

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
    const {setErrorMessage, setSuccessMessage, setOnDismiss, dismissTime} = useNotification();
    const [kriteriaList, setKriteriaList] = useState<TypeTableData<Kriteria>[]>([]);
    const [{}, setSelectedRows] = useState<number[]>([]);
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
                    code: selectedKriteria.code,
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
                    kriteria.code === selectedKriteria.code
                        ? {...kriteria, name: updatedData[1]}
                        : kriteria
                )
            );

            setIsAddFormOpen(false);
        }
        setIsEditFormOpen(false);
        setSelectedKriteria(null);
        setSuccessMessage("success")
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
                code: idKriteria,
                name: namaKriteria,
            }),
        });
        if (!response.ok) {
            const data = await response.json();
            setErrorMessage(data.error);
            return
        }
        setIsAddFormOpen(false);
        setSuccessMessage("success")
        setOnDismiss(()=>setTimeout(()=> router.reload(), dismissTime + 100))
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
            setKriteriaList(data);
        }

        if (responseCount.ok) {
            const countData = await responseCount.json() as { total: number }[];
            setTotalRecords(countData[0].total);
            setInit(true)
        }
    };

    const handleDelete = async (selectedRows: number[]) => {
            const values = selectedRows.join(',');
            const response = await fetch(`/api/data?type=kriteria&ids=${values}&primary_column=id`, {
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
           setSuccessMessage("success")
    };

    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    useEffect(() => {
        fetchData(currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage]);

    return (
        <>
            <NavBar user={user}/>
            <div className="p-4">
                <h1 className="text-4xl font-semibold mt-10 mb-5 text-center">Kriteria</h1>
                <Table
                    columns={[
                        {title: 'ID Kriteria', key: 'id'},
                        {title: 'Nama Kriteria', key: 'nama'},
                        {title: "Jumlah", key: 'jumlah'},
                        {title: 'Bobot', key: 'bobot'},
                    ]}
                    data={kriteriaList}
                    onRowSelect={(selectedRows) => setSelectedRows(selectedRows)}
                    onEdit={(kriteria: TypeTableData<Kriteria>) => (setSelectedKriteria(kriteria), setIsEditFormOpen(true))}
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
                            {label: "ID Kriteria", defaultValue: String(selectedKriteria.code), disabled: true},
                            {label: 'Nama Kriteria', defaultValue: selectedKriteria.name},
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

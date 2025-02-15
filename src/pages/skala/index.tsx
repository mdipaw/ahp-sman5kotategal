import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {NavBar, Footer} from "@/components";
import {GetServerSideProps} from "next";
import {getUser} from "@/lib/auth";
import {Scale, User} from "@/types/api";
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
    const {setErrorMessage, setSuccessMessage, setOnDismiss, dismissTime} = useNotification();
    const router = useRouter();
    const [skalaList, setSkalaList] = useState<TypeTableData<Scale>[]>([]);
    const [{}, setSelectedRows] = useState<number[]>([]);
    const [selectedSkala, setSelectedSkala] = useState<TypeTableData<Scale> | null>(null);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalRecords, setTotalRecords] = useState(0); // New state to store total records count
    const [init, setInit] = useState<boolean>(false);

    const handleEditSubmit = async (updatedData: string[]) => {
        if (selectedSkala) {
            const response = await fetch("/api/data", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: 'scale',
                    id: selectedSkala.id,
                    value: updatedData[1],
                    name: updatedData[2],
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                setErrorMessage(data.error);
                return
            }
            setSkalaList((prevList) =>
                prevList.map((skala) =>
                    skala.id === selectedSkala.id
                        ? {...skala, value: Number(updatedData[1]), name: updatedData[2]}
                        : skala
                )
            );
            setIsAddFormOpen(false);
            setSuccessMessage("succss")
        }
    };

    const handleAddSubmit = async (newData: string[]) => {
        const [value, name] = newData;
        const response = await fetch("/api/data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: 'scale',
                name: name,
                value: value,
            }),
        });
        if (!response.ok) {
            const data = await response.json();
            setErrorMessage(data.error);
            return
        }
        setIsAddFormOpen(false);
        setSuccessMessage("succss")
        setOnDismiss(() => setTimeout(() => router.reload(), dismissTime + 100))

    };

    const fetchData = async (page: number, limit: number) => {
        if (totalRecords <= rowsPerPage && init) return
        const offset = (page - 1) * limit;
        const [responseData, responseCount] = await Promise.all([
            fetch(`/api/data?type=scale&limit=${limit}&offset=${offset}`),
            fetch(`/api/data?type=count&type_count=scale`)
        ])

        if (responseData.ok) {
            const data = await responseData.json() as Scale[];
            setSkalaList(data.map((k: Scale) => ({...k, id: k.id})));
        }

        if (responseCount.ok) {
            const countData = await responseCount.json() as { total: number }[];
            setTotalRecords(countData[0].total);
            setInit(true)
        }
    };

    const handleDelete = async (selectedRows: number[]) => {
        const values = selectedRows.join(',');
        const response = await fetch(`/api/data?type=scale&primary_column=id&ids=${values}`, {
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
        setSkalaList((prevList) =>
            prevList.filter((skala) => !selectedRows.includes(skala.id))
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
                <h1 className="text-4xl font-semibold mt-10 mb-5 text-center">Skala dasar</h1>
                <Table
                    columns={[
                        {title: 'Nilai', key: 'id_kriteria'},
                        {title: 'Keterangan', key: 'nama'},
                    ]}
                    data={skalaList}
                    onRowSelect={(selectedRows) => setSelectedRows(selectedRows)}
                    onEdit={(kriteria: TypeTableData<Scale>) => (setSelectedSkala(kriteria), setIsEditFormOpen(true))}
                    onDelete={handleDelete}
                    onAdd={() => setIsAddFormOpen(true)}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage as 5}
                    totalPages={totalPages}
                    onPageChange={(page) => handlePageChange(page, setCurrentPage)}
                    onRowsPerPageChange={(rows) => handleRowsPerPageChange(rows, setRowsPerPage, setCurrentPage, fetchData)}
                    skipValueOnData={['id_nilai']}
                />

                {selectedSkala && (
                    <EditForm
                        title="Edit Nilai"
                        isOpen={isEditFormOpen}
                        onClose={() => setIsEditFormOpen(false)}
                        onSubmit={handleEditSubmit}
                        inputs={[
                            {label: "ID skala", defaultValue: String(selectedSkala.id), disabled: true},
                            {label: 'Nilai', defaultValue: String(selectedSkala.value)},
                            {label: 'Keterangan', defaultValue: selectedSkala.name},
                        ]}
                    />
                )}

                <AddForm
                    title="Tambah Nilai"
                    isOpen={isAddFormOpen}
                    onClose={() => setIsAddFormOpen(false)}
                    onSubmit={handleAddSubmit}
                    inputs={[
                        {label: 'Nilai', defaultValue: ''},
                        {label: "Keterangan", defaultValue: ''},
                    ]}
                />
            </div>
            <Footer/>
        </>
    );
};

export default KriteriaPage;

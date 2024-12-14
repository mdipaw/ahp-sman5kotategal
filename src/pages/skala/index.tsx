import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import {NavBar, Footer} from "@/components";
import {GetServerSideProps} from "next";
import {getUser} from "@/lib/auth";
import {Skala, User} from "@/types/api";
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
    const router = useRouter();
    const [skalaList, setSkalaList] = useState<TypeTableData<Skala>[]>([]);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [selectedSkala, setSelectedSkala] = useState<TypeTableData<Skala> | null>(null);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalRecords, setTotalRecords] = useState(0); // New state to store total records count
    const [init, setInit] = useState<boolean>(false);

    const handleEditSubmit = async (updatedData: string[]) => {
        if (selectedSkala) {
            console.log(selectedSkala);
            console.log(updatedData);
            const response = await fetch("/api/data", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: 'nilai',
                    id_nilai: selectedSkala.id,
                    jum_nilai: updatedData[1],
                    ket_nilai: updatedData[2],
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
                        ? {...skala, jum_nilai:Number(updatedData[1]), ket_nilai: updatedData[2]}
                        : skala
                )
            );

            setIsAddFormOpen(false);
        }
        setIsEditFormOpen(false);
    };

    const handleAddSubmit = async (newData: string[]) => {
        const [ nilai, ket] = newData;
        const response = await fetch("/api/data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: 'nilai',
                ket_nilai: ket,
                jum_nilai: nilai,
            }),
        });
        if (!response.ok) {
            const data = await response.json();
            setErrorMessage(data.error);
            return
        }
        setIsAddFormOpen(false);
        router.reload()

    };

    const fetchData = async (page: number, limit: number) => {
        if (totalRecords <= rowsPerPage && init) return
        const offset = (page - 1) * limit;
        const [responseData, responseCount] = await Promise.all([
            fetch(`/api/data?type=nilai&limit=${limit}&offset=${offset}`),
            fetch(`/api/data?type=count&type_count=nilai`)
        ])

        if (responseData.ok) {
            const data = await responseData.json() as Skala[];
            setSkalaList(data.map((k: Skala)  => ({...k, id: `${k.id_nilai}`})));
        }

        if (responseCount.ok) {
            const countData = await responseCount.json() as { total: number }[];
            setTotalRecords(countData[0].total);
            setInit(true)
        }
    };

    const handleDelete = async (selectedRows: string[]) => {
        const values = selectedRows.join(',');
        const response = await fetch(`/api/data?type=nilai&primary_column=id_nilai&ids=${values}`, {
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
                        {title: 'Nilai', key: 'id_kriteria'},
                        {title: 'Keterangan', key: 'nama'},
                    ]}
                    data={skalaList}
                    onRowSelect={(selectedRows) => setSelectedRows(selectedRows)}
                    onEdit={(kriteria: TypeTableData<Skala & {
                        id: string
                    }>) => (setSelectedSkala(kriteria), setIsEditFormOpen(true))}
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
                            {label: "ID skala", defaultValue: String(selectedSkala.id_nilai), disabled: true},
                            {label: 'Nilai', defaultValue: String(selectedSkala.jum_nilai)},
                            {label: 'Keterangan', defaultValue: selectedSkala.ket_nilai},
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

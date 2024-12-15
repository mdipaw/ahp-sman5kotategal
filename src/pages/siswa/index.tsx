import React, {useEffect, useState} from 'react';
import {NavBar, Footer} from "@/components";
import {GetServerSideProps} from "next";
import {getUser} from "@/lib/auth";
import {Student, User} from "@/types/api";
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

const SiswaPage = ({user}: { user: User }) => {
    const {setErrorMessage, setSuccessMessage, setOnDismiss, dismissTime} = useNotification();
    const [student, setStudent] = useState<TypeTableData<Student>[]>([]);
    const [{}, setSelectedRows] = useState<number[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<TypeTableData<Student> | null>(null);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalRecords, setTotalRecords] = useState(0); // New state to store total records count
    const [init, setInit] = useState<boolean>(false);

    const handleEditSubmit = async (updatedData: string[]) => {
        if (selectedStudent) {
            const [code, name,  klass, dob, gender, address ] = updatedData;
            const response = await fetch("/api/data", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: 'student',
                    code: selectedStudent.code,
                    name,
                    class:klass,
                    dob,
                    gender,
                    address,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                setErrorMessage(data.error);
                return
            }
            setStudent((prevList) =>
                prevList.map((kriteria) =>
                    kriteria.code === selectedStudent.code
                        ? {...kriteria, name: updatedData[1]}
                        : kriteria
                )
            );

            setIsAddFormOpen(false);
        }
        setIsEditFormOpen(false);
        setSelectedStudent(null);
        setSuccessMessage("success")
    };

    const handleAddSubmit = async (newData: string[]) => {
        const [code, name,  klass, dob, gender, address ] = newData;
        console.log(newData);
        const response = await fetch("/api/data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: 'student',
                code,
                name,
                class:klass,
                dob,
                gender,
                address,
            }),
        });
        if (!response.ok) {
            const data = await response.json();
            setErrorMessage(data.error);
            return
        }
        setIsAddFormOpen(false);
        setSuccessMessage("success")
        setOnDismiss(() => setTimeout(() => router.reload(), dismissTime + 100))
    };

    const fetchData = async (page: number, limit: number) => {
        if (totalRecords <= rowsPerPage && init) return
        const offset = (page - 1) * limit;
        const [responseData, responseCount] = await Promise.all([
            fetch(`/api/data?type=student&limit=${limit}&offset=${offset}`),
            fetch(`/api/data?type=count&type_count=student`)
        ])

        if (responseData.ok) {
            const data = await responseData.json() as Student[];
            setStudent(data);
        }

        if (responseCount.ok) {
            const countData = await responseCount.json() as { total: number }[];
            setTotalRecords(countData[0].total);
            setInit(true)
        }
    };

    const handleDelete = async (selectedRows: number[]) => {
        const values = selectedRows.join(',');
        const response = await fetch(`/api/data?type=student&ids=${values}&primary_column=id`, {
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
        setStudent((prevList) =>
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
                <Table
                    columns={[
                        {title: 'ID siswa', key: 'id'},
                        {title: 'Nama siswa', key: 'nama'},
                        {title: 'Kelas', key: 'class'},
                        {title: "Tanggal lahir", key: 'dob'},
                        {title: 'Jenis kelamin', key: 'gender'},
                        {title: 'Alamat', key: 'address'},
                    ]}
                    data={student}
                    onRowSelect={(selectedRows) => setSelectedRows(selectedRows)}
                    onEdit={(student: TypeTableData<Student>) => (setSelectedStudent(student), setIsEditFormOpen(true))}
                    onDelete={handleDelete}
                    onAdd={() => setIsAddFormOpen(true)}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage as 5}
                    totalPages={totalPages}
                    onPageChange={(page) => handlePageChange(page, setCurrentPage)}
                    onRowsPerPageChange={(rows) => handleRowsPerPageChange(rows, setRowsPerPage, setCurrentPage, fetchData)}
                />

                {selectedStudent && (
                    <EditForm
                        title="Edit Kriteria"
                        isOpen={isEditFormOpen}
                        onClose={() => setIsEditFormOpen(false)}
                        onSubmit={handleEditSubmit}
                        inputs={[
                            {label: "ID siswa", defaultValue: selectedStudent.code, disabled: true},
                            {label: 'Nama siswa', defaultValue: selectedStudent.name},
                            {label: 'Kelas', defaultValue: selectedStudent.class},
                            {label: 'Tanggal lahir', defaultValue: selectedStudent.dob},
                            {label: 'Jenis kelamin', defaultValue: selectedStudent.gender},
                            {label: 'Alamat', defaultValue: selectedStudent.address},
                        ]}
                    />
                )}

                <AddForm
                    title="Tambah Kriteria"
                    isOpen={isAddFormOpen}
                    onClose={() => setIsAddFormOpen(false)}
                    onSubmit={handleAddSubmit}
                    inputs={[
                        {label: "ID siswa", defaultValue: ''},
                        {label: 'Nama siswa', defaultValue: ''},
                        {label: 'Kelas', defaultValue: ''},
                        {label: 'Tanggal lahir', defaultValue: ''},
                        {label: 'Jenis kelamin', defaultValue: ''},
                        {label: 'Alamat', defaultValue: ''},
                    ]}
                />
            </div>
            <Footer/>
        </>
    );
};

export default SiswaPage;

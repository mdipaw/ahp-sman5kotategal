import React, { useEffect, useState } from 'react';
import { NavBar, Footer } from "@/components";
import { GetServerSideProps } from "next";
import { getUser } from "@/lib/auth";
import { Kriteria, Score, Student, User } from "@/types/api";
import { useNotification } from "@/context/NotificationContext";
import {getScoreDescription} from "@/lib/conversion";

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

const PenilaianPage = ({ user }: { user: User }) => {
    const { setErrorMessage, setSuccessMessage, setOnDismiss, dismissTime } = useNotification();
    const [score, setScore] = useState<Score<{ [key: string]: any }> | null>(null);
    const [scoreCode, setScoreCode] = useState<string[]>(["Baru"]);
    const [kriteria, setKriteria] = useState<Kriteria[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
    const [selectedSiswa, setSelectedSiswa] = useState<string>("");
    const [siswa, setSiswa] = useState<Student[]>([]);
    const [inputAddValues, setInputAddValues] = useState<{ [key: string]: any }>({});
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedCode, setSelectedCode] = useState<string>("Baru");

    const fetchData = async () => {
        const response = await fetch(`/api/score`);
        const data = await response.json();
        if (!response.ok) {
            setErrorMessage(data.error);
            return;
        }
        setScore(data);
        const scoreCode = ["Baru"];
        const v = Object.keys(data);
        scoreCode.push(...v);
        setScoreCode(scoreCode);

        const responseKriteria = await fetch("/api/data?type=kriteria");
        const dataKriteria = await responseKriteria.json();
        if (!response.ok) {
            setErrorMessage(data.error);
            return;
        }
        setKriteria(dataKriteria);

        const responseSiswa = await fetch("/api/data?type=student");
        const dataSiswa = await responseSiswa.json();
        if (!response.ok) {
            setErrorMessage(data.error);
            return;
        }
        setSiswa(dataSiswa);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddSubmit = async () => {
        const submitData = {
            selectedCode,
            selectedSiswa,
            inputAddValues,
        };

        const response = await fetch("/api/data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ type: "score", data: submitData }),
        });

        const result = await response.json();

        if (response.ok) {
            setSuccessMessage("success");
            setOnDismiss(() => setTimeout(() => fetchData(), dismissTime + 100));
        } else {
            setErrorMessage(result.error || "Something went wrong.");
        }

        setIsAddOpen(false);
    };

    const handleEditSubmit = async () => {
        const submitData = {
            selectedCode,
            selectedSiswa,
            inputAddValues,
        };

        const response = await fetch(`/api/data/${selectedStudent.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ type: "score", data: submitData }),
        });

        const result = await response.json();

        if (response.ok) {
            setSuccessMessage("Record updated successfully.");
            setOnDismiss(() => setTimeout(() => fetchData(), dismissTime + 100));
        } else {
            setErrorMessage(result.error || "Failed to update record.");
        }

        setIsEditOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, code: string) => {
        setInputAddValues((prev) => ({
            ...prev,
            [code]: e.target.value,
        }));
    };

    const handleDelete = async (scoreId: number) => {
        if (confirm("Are you sure you want to delete this entry?")) {
            const response = await fetch(`/api/score?id=${scoreId}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (response.ok) {
                setSuccessMessage("success");
                setOnDismiss(() => setTimeout(() => fetchData(), dismissTime + 100));
            } else {
                setErrorMessage(result.error || "gagal");
            }
        }
    };

    const openEditForm = (student: any) => {
        setSelectedStudent(student);
        setSelectedSiswa(student.student_id);
        setInputAddValues(JSON.parse(student.data));
        setSelectedCode(student.code || "Baru");
        setIsEditOpen(true);
    };

    return (
        <>
            <NavBar user={user}/>
            <h1 className="text-4xl font-semibold mt-10 mb-5 text-center">Penilaian siswa</h1>
            <div className="flex justify-end p-8 mb-0">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => setIsAddOpen(true)}
                >
                    Tambah
                </button>
            </div>

            {/* Add Form */}
            {isAddOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-[400px]">
                        <h2 className="text-xl mb-4">Add</h2>
                        <div className="space-y-4">
                            <select
                                value={selectedCode}
                                onChange={(e) => setSelectedCode(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                {scoreCode.map((input, index) => (
                                    <option key={index} value={input}>
                                        {input}
                                    </option>
                                ))}
                            </select>

                            {selectedCode === "Baru" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Code</label>
                                    <input
                                        value={inputAddValues['code'] || ''}
                                        type="text"
                                        onChange={(e) => handleInputChange(e, 'code')}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            )}

                            <select
                                value={selectedSiswa}
                                onChange={(e) => setSelectedSiswa(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Select Student</option>
                                {siswa.map((s, index) => (
                                    <option key={index} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>

                            {kriteria.map((k, index) => (
                                <div key={index}>
                                    <label className="block text-sm font-medium text-gray-700">{k.name}</label>
                                    <input
                                        type="number"
                                        value={inputAddValues[k.code] || ''}
                                        onChange={(e) => handleInputChange(e, k.code)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={() => setIsAddOpen(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddSubmit}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Form */}
            {isEditOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-[400px]">
                        <h2 className="text-xl mb-4">Edit</h2>
                        <div className="space-y-4">
                            <select
                                value={selectedCode}
                                onChange={(e) => setSelectedCode(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                {scoreCode.map((input, index) => (
                                    <option key={index} value={input}>
                                        {input}
                                    </option>
                                ))}
                            </select>

                            {selectedCode === "Baru" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Code</label>
                                    <input
                                        value={inputAddValues['code'] || ''}
                                        type="text"
                                        onChange={(e) => handleInputChange(e, 'code')}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            )}

                            <select
                                value={selectedSiswa}
                                onChange={(e) => setSelectedSiswa(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Select Student</option>
                                {siswa.map((s, index) => (
                                    <option key={index} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>

                            {kriteria.map((k, index) => (
                                <div key={index}>
                                    <label className="block text-sm font-medium text-gray-700">{k.name}</label>
                                    <input
                                        type="number"
                                        value={inputAddValues[k.code] || ''}
                                        onChange={(e) => handleInputChange(e, k.code)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSubmit}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="p-4">
                {/* Looping through the Score object */}
                {score
                    ? Object.keys(score).map((code) => (
                        <div key={code} className="mb-8">
                            <h1 className="text-4xl font-semibold mt-10 mb-5">{code}</h1>
                            <table className="min-w-full table-auto border-collapse border border-gray-300">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 border border-gray-300">Nama siswa</th>
                                    {kriteria.map((kriteriaItem) => (
                                        <th key={kriteriaItem.code} className="px-4 py-2 border border-gray-300">
                                            {kriteriaItem.name}
                                        </th>
                                    ))}
                                    <th className="px-4 py-2 border border-gray-300">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {score[code].map((s) => {
                                    const data = JSON.parse(s.data as unknown as string);
                                    return (
                                        <tr
                                            key={s.id}
                                            className="hover:bg-gray-50 cursor-pointer"
                                            onClick={() => {
                                                setSelectedStudent(s);
                                            }}
                                        >
                                            <td className="px-4 py-2 border border-gray-300">{s.student_name}</td>
                                            {kriteria.map((kriteriaItem) => (
                                                <td key={kriteriaItem.code}
                                                    className="px-4 py-2 border border-gray-300">
                                                    {data[kriteriaItem.code]} = { getScoreDescription(data[kriteriaItem.code])}
                                                </td>
                                            ))}
                                            <td className="px-4 py-2 border border-gray-300 flex justify-center space-x-2">
                                                <button
                                                    onClick={() => openEditForm(s)}
                                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(s.id)}
                                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    ))
                    : null}
            </div>

            <Footer/>
        </>
    );
};

export default PenilaianPage;

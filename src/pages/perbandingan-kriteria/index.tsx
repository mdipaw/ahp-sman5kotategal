import { GetServerSideProps } from "next";
import { getUser } from "@/lib/auth";
import { Footer, NavBar } from "@/components";
import {Comparison, Kriteria, Skala, User} from "@/types/api";
import { useState, useEffect } from "react";
import {formatValue} from "@/lib/conversion";
import {calculateAhp} from "@/lib/ahp";
import {router} from "next/client";
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

const PerbandinganPage = ({ user }: { user: User }) => {
    const {setErrorMessage, setSuccessMessage, setOnDismiss, dismissTime} = useNotification();
    const [kriteria, setKriteria] = useState<Kriteria[]>([]);
    const [scale, setScale] = useState<Skala[]>([]);
    const [comparisons, setComparisons] = useState<Record<string, Record<string, number>>>({});
    const [comparison, setComparison] = useState<Comparison[]>([]);
    const [canSubmit, setCanSubmit] = useState<boolean>(false);

    const fetchData = async <T extends object>(type: string, setter:React.Dispatch<React.SetStateAction<T>>) => {
        const response = await fetch(`/api/data?type=${type}`);
        const data = await response.json();
        if (!response.ok) {
            setErrorMessage(data.error)
            return
        }
        setter(data);
    };

    useEffect(() => {
        fetchData('kriteria', setKriteria);
        fetchData('nilai', setScale);
        fetchData('comparison', setComparison);
    }, []);


    const handleChangeComparison = (kriteria1: string, kriteria2: string, value: number) => {
        setComparisons((prev) => ({
            ...prev,
            [kriteria1]: {
                ...prev[kriteria1],
                [kriteria2]: value,
            },
            [kriteria2]: {
                ...prev[kriteria2],
                [kriteria1]: 1 / value,
            },
        }));
    };

    useEffect(() => {
        if (comparison.length > 0) {
            const newComparisons: Record<string, Record<string, number>> = {};
            comparison.forEach((item) => {
                const { code_kriteria_1, code_kriteria_2, value } = item;

                if (!newComparisons[code_kriteria_1]) {
                    newComparisons[code_kriteria_1] = {};
                }
                if (!newComparisons[code_kriteria_2]) {
                    newComparisons[code_kriteria_2] = {};
                }

                newComparisons[code_kriteria_1][code_kriteria_2] = value;
                newComparisons[code_kriteria_2][code_kriteria_1] = 1 / value;
            });
            setComparisons(newComparisons);
        }
    }, [comparison]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const comparisonArrayObj = kriteria.map((kriteria1) =>
            kriteria.map((kriteria2) => {
                return {
                    id: Date.now(),
                    code_kriteria_1: kriteria1.code,
                    code_kriteria_2: kriteria2.code,
                    value: comparisons[kriteria1.code]?.[kriteria2.code] ?? 1,
                };
            })
        ).flat();
        setComparison(comparisonArrayObj);
        const sumsWeights = calculateAhp(kriteria, comparisons);
        const response = await fetch("/api/data?type=comparison", {
            method: "POST",
            body: JSON.stringify({
                type: 'comparison',
                values: comparisonArrayObj.map((k) => [k.code_kriteria_1, k.code_kriteria_2, k.value]),
                sumsWeights: sumsWeights,

            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
        if (!response.ok) {
            const data = await response.json();
            setErrorMessage(data.error)
            return
        }
        setSuccessMessage("success")
        setOnDismiss(() => setTimeout(() => router.push("/kriteria"), dismissTime + 200))
    };

    return (
        <>
            <NavBar user={user} />
            <div className="px-8 pt-16">
                <form onSubmit={handleSubmit} className="min-w-full">
                    <table className="min-w-full border border-gray-300 table-auto">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border border-gray-300">Kriteria</th>
                            {kriteria.map((kriteria) => (
                                <th key={kriteria.id} className="p-2 border border-gray-300 text-left">
                                    {kriteria.code} - {kriteria.name}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {kriteria.map((kriteria1) => (
                            <tr key={kriteria1.id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 p-2 break-words">
                                    {kriteria1.name}
                                </td>
                                {kriteria.map((kriteria2) => (
                                    <td key={kriteria2.id} className="p-2 border border-gray-300 text-center break-words">
                                        {kriteria1.id !== kriteria2.id && (
                                            <select
                                                value={comparisons[kriteria1.code]?.[kriteria2.code] || 1}
                                                onChange={(e) =>
                                                    (handleChangeComparison(
                                                        kriteria1.code,
                                                        kriteria2.code,
                                                        parseFloat(e.target.value)
                                                    ), setCanSubmit(true))
                                                }
                                                className="w-full"
                                            >
                                                {scale.map((option) => (
                                                    <option key={option.id_nilai} value={option.jum_nilai}>
                                                        {formatValue(option.jum_nilai)} - {option.ket_nilai}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                        {kriteria1.id === kriteria2.id && (
                                            <span>1 - {scale.find(v => v.jum_nilai === 1)?.ket_nilai}</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="grid justify-end mt-4">
                        <button type="submit" disabled={!canSubmit}
                                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-400">
                            Hitung Bobot
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default PerbandinganPage;

import React, {useEffect, useState} from 'react';
import {Kriteria, Score, User} from '@/types/api';
import {formatValue} from "@/lib/conversion";
import {Footer, NavBar} from "@/components";
import {GetServerSideProps} from "next";
import {getUser} from "@/lib/auth";

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

const HasilAkhirPage = ({user}: { user: User }) => {
    const [score, setScore] = useState<Score<{ [key: string]: any }> | null>(null);
    const [kriteria, setKriteria] = useState<Kriteria[]>([]);

    const fetchData = async () => {
        const [responseScore, responseKriteria] = await Promise.all([
            fetch('/api/score'),
            fetch('/api/data?type=kriteria'),
        ]);

        if (responseScore.ok) {
            setScore(await responseScore.json());
        }
        if (responseKriteria.ok) {
            setKriteria(await responseKriteria.json());
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Function to calculate ranking based on total score
    const calculateRanking = (students: [{
        id: number;
        code: string;
        student_id: number;
        student_name: string;
        data: { [p: string]: any }
    }]) => {
        return students
            .map((student) => {
                // Parse the stringified 'data' field which includes 'weight_values'
                const parsedData = JSON.parse(student.data as unknown as string); // Parse the entire data object
                const {weight_values} = parsedData; // Extract weight_values from parsed data

                return {
                    ...student,
                    totalScore: Object.keys(parsedData).reduce(
                        (acc, key) => {
                            // Exclude weight_values from being counted as a score
                            if (key !== 'weight_values') {
                                acc += (parsedData[key] * (weight_values[key] || 0));
                            }
                            return acc;
                        },
                        0
                    ),
                    data: parsedData, // Store parsed data
                };
            })
            .sort((a, b) => b.totalScore - a.totalScore); // Sort students by total score
    };

    return (
        <>
            <NavBar user={user}/>
            <div className="space-y-8">
                <h1 className="text-4xl font-semibold mt-10 mb-5 text-center">Hasil AHP</h1>
                {score &&
                    Object.keys(score).map((key) => {
                        const students = score[key];
                        const rankedScores = calculateRanking(students); // Calculate rankings for each group

                        return (
                            <div key={key} className="overflow-x-auto">
                                <h2 className="text-xl font-semibold mt-10 mb-5 text-center">{key}</h2>
                                <table className="min-w-full table-auto border-collapse border border-gray-300">
                                    <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 border border-gray-300 text-center">Nama Siswa</th>
                                        {kriteria.map((k, index) => (
                                            <th key={index} className="px-4 py-2 border border-gray-300 text-center">
                                                {k.name}
                                            </th>
                                        ))}
                                        <th className="px-4 py-2 border border-gray-300 text-center">Ranking</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {rankedScores.map((student, idx) => (
                                        <tr key={student.student_id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border border-gray-300 text-center">
                                                {student.student_name} {/* Display student name instead of code */}
                                            </td>
                                            {kriteria.map((k) => (
                                                <td key={k.code}
                                                    className="px-4 py-2 border border-gray-300 text-center">
                                                    {formatValue(student.data[k.code] * student.data.weight_values[k.code])}
                                                </td>
                                            ))}
                                            <td className="px-4 py-2 border border-gray-300 text-center">{idx + 1}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        );
                    })}
            </div>
            <Footer/>
        </>

    );
};

export default HasilAkhirPage;

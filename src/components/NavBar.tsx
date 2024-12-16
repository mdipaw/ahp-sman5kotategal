import React, { useState } from 'react';
import Link from 'next/link';
import {Comparison, Kriteria, Score, ScoreData, User} from "@/types/api";
import {
    LaporanFooter,
    LaporanHasilAkhir,
    LaporanHeader,
    LaporanKriteria,
    LaporanPenilaian,
    LaporanSiswa
} from "@/components/laporan";
import { Document, Page, pdf, StyleSheet } from "@react-pdf/renderer";
import { useNotification } from "@/context/NotificationContext";

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 10,
        fontFamily: 'Times New Roman',
    },
});

const fetchComparison = async ():Promise<Comparison[]> => {
    const response = await fetch(`/api/data?type=comparison`);
    const data = await response.json();
    if (!response.ok) {
       throw Error('error')
    }
    return data
}

const LaporanPDF = async (data: any, type: string, kriteria?: Kriteria[], score?: ScoreData[]): Promise<Blob> => {
    let Data;
    switch (type) {
        case 'student':
            Data = LaporanSiswa(data);
            break;
        case 'penilaian':
            Data = LaporanPenilaian({score: score as ScoreData[], kriteria: kriteria as any});
            break;
        case 'hasil-akhir':
            Data = LaporanHasilAkhir({score: score as ScoreData[], kriteria: kriteria as Kriteria[]});
            break;
        case 'kriteria':
            const comparison = await  fetchComparison();
            Data = LaporanKriteria(data, comparison);
            break;
        default:
            Data = null;
            break;
    }

    const renderPdf = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <LaporanHeader />
                {Data}
                <LaporanFooter />
            </Page>
        </Document>
    );

    return pdf(renderPdf()).toBlob();
};

export const NavBar = ({ user }: { user: User }) => {
    const { setErrorMessage } = useNotification();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLaporanDropdownOpen, setIsLaporanDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [option, setOption] = useState<string[]>([]);
    const [selectedScoreCode, setSelectedScoreCode] = useState<string>('');
    const [score, setScore] = useState<Score<any>>()
    const [selectedLaporan, setSelectedLaporan] = useState<string>("")

    const toggleDropdown = (setState: React.Dispatch<React.SetStateAction<boolean>>) => {
        setState((prevState) => !prevState);
    };

    // Handle fetching kriteria data
    const handleLaporan = async (type: string) => {
        try {
            if (type === 'penilaian' || type === 'hasil-akhir') {
                setSelectedLaporan(type)
                const response = await fetch('/api/score');
                if (!response.ok) {
                    setErrorMessage("failed fetch penilaian")
                    return
                }
                const data = await response.json();
                setScore(data);
                setOption(Object.keys(data))
                setIsModalOpen(true);

            } else {
                const response = await fetch(`/api/data?type=${type}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data for ${type}`);
                }
                const data = await response.json();
                const blob = await LaporanPDF(data, type);
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${type}-laporan.pdf`;
                link.click();
            }
        } catch (err: any) {
            setErrorMessage(err.message || "Error");
        }
    };

    // Handle modal closing and PDF generation
    const handleModalClose = async () => {
        setIsModalOpen(false);
        if (selectedScoreCode) {
            const response = await fetch(`/api/data?type=kriteria`)
            if(!response.ok) {
                setErrorMessage("failed fetch kriteria")
                return
            }

            const kriteria = await response.json();
            const blob = await LaporanPDF(null, selectedLaporan, kriteria, score![selectedScoreCode] as any);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `penilaian-laporan-${selectedScoreCode}.pdf`;
            link.click();
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <nav className="bg-gray-800 p-4 shadow-md fixed w-full top-0 left-0 z-10">
                <div className="flex items-center justify-between">
                    <div className="text-white text-2xl font-semibold">
                        <Link href="/">Beranda</Link>
                    </div>
                    <div className="flex justify-center mx-auto space-x-4 text-white">
                        {user!.role === 'admin' && (
                            <Link href="/siswa" className="hover:text-yellow-300">
                                Siswa
                            </Link>
                        )}
                        {user!.role === 'guru' && (
                            <>
                                <Link href="/skala" className="hover:text-yellow-300">
                                    Skala Dasar
                                </Link>
                                <Link href="/kriteria" className="hover:text-yellow-300">
                                    Kriteria
                                </Link>
                                <Link href="/perbandingan-kriteria" className="hover:text-yellow-300">
                                    Perbandingan
                                </Link>
                                <Link href="/penilaian" className="hover:text-yellow-300">
                                    Penilaian
                                </Link>
                                <Link href="/hasil-akhir" className="hover:text-yellow-300">
                                    Hasil Akhir
                                </Link>
                                <div className="relative inline-block">
                                    <button
                                        className="text-white hover:text-yellow-300"
                                        onClick={() => toggleDropdown(setIsLaporanDropdownOpen)}
                                    >
                                        Laporan
                                    </button>
                                    <div
                                        className={`${isLaporanDropdownOpen ? 'block' : 'hidden'} dropdown-menu absolute text-gray-700 bg-white shadow-md rounded-lg w-48 mt-2`}
                                    >
                                        <Link href="#" onClick={() => handleLaporan('student')}
                                              className="block px-4 py-2 text-sm">
                                            Laporan Data Siswa
                                        </Link>
                                        <Link href="#" onClick={() => handleLaporan('kriteria')}
                                              className="block px-4 py-2 text-sm">
                                            Laporan Data Kriteria
                                        </Link>
                                        <Link href="#" onClick={() => handleLaporan('penilaian')}
                                              className="block px-4 py-2 text-sm">
                                            Laporan Penilaian
                                        </Link>
                                        <Link href="#" onClick={() => handleLaporan('hasil-akhir')}
                                              className="block px-4 py-2 text-sm">
                                            Laporan Hasil Akhir
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="relative inline-block px-12">
                        <button
                            className="text-white hover:text-yellow-300"
                            onClick={() => toggleDropdown(setIsProfileDropdownOpen)}
                        >
                            {user!.nama_lengkap}
                        </button>
                        {/* Dropdown Profile */}
                        <div
                            className={`${
                                isProfileDropdownOpen ? 'block' : 'hidden'
                            } dropdown-menu absolute text-gray-700 bg-white shadow-md rounded-lg w-48 mt-2`}
                        >
                            <Link href="/profil" className="block px-4 py-2 text-sm">
                                Profil
                            </Link>
                            {user!.role === 'admin' && (
                                <Link href="/user" className="block px-4 py-2 text-sm">
                                    Manajer Pengguna
                                </Link>
                            )}
                            <div className="border-t border-gray-200">
                                <Link href="/logout" className="block px-4 py-2 text-sm text-red-500">
                                    Logout
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Modal to select score code */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Unduh laporan {}</h2>
                        <select
                            value={selectedScoreCode}
                            onChange={(e) => setSelectedScoreCode(e.target.value)}
                            className="border border-gray-300 rounded-md p-2"
                        >
                            <option value="">--Pilih Code--</option>
                            {option.map((k) => (
                                <option key={k} value={k}>
                                    {k}
                                </option>
                            ))}
                        </select>
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-500 text-white rounded-md"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                onClick={handleModalClose}
                            >
                                Unduh Laporan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

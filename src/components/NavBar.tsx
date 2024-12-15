import React, {useState} from 'react';
import Link from 'next/link';
import {Siswa, Kriteria, HasilAkhir, User} from "@/types/api";
import {
    LaporanFooter,
    LaporanHasilAkhir,
    LaporanHeader,
    LaporanKriteria,
    LaporanPenilaian,
    LaporanSiswa
} from "@/components/laporan";
import {Document, Page, pdf, StyleSheet} from "@react-pdf/renderer";


const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 10,
        fontFamily: 'Times New Roman',
    },
});

const LaporanPDF = (data: Siswa[] | Kriteria[] | HasilAkhir[], type: string): Promise<Blob> => {
    let Data;

    switch (type) {
        case 'siswa':
            Data = LaporanSiswa(data as Siswa[]);
            break;
        case 'penilaian':
            Data = LaporanPenilaian(data as any[]);
            break;
        case 'hasil-akhir':
            Data = LaporanHasilAkhir(data as HasilAkhir[]);
            break;
        case 'kriteria':
            Data = LaporanKriteria(data as Kriteria[]);
            break;
        default:
            Data = null;
            break;
    }

    const renderPdf = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <LaporanHeader/>
                {Data}
                <LaporanFooter/>
            </Page>
        </Document>
    );

    return pdf(renderPdf()).toBlob();
};

export const NavBar = ({user}: { user: User }) => {

    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isPerbandinganDropdownOpen, setIsPerbandinganDropdownOpen] = useState(false);
    const [isHasilAkhirDropdownOpen, setIsHasilAkhirDropdownOpen] = useState(false);
    const [isLaporanDropdownOpen, setIsLaporanDropdownOpen] = useState(false);

    const toggleDropdown = (setState: React.Dispatch<React.SetStateAction<boolean>>) => {
        setState((prevState) => !prevState);
    };



    const handleLaporan = async (type: string) => {
        try {
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
        } catch (err) {
            console.error('Error generating PDF:', err);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <nav className="bg-gray-800 p-4 rounded-lg shadow-md fixed w-full top-0 left-0 z-10">
                <div className="flex items-center justify-between">
                    <div className="text-white text-2xl font-semibold">
                        <Link href="/">Home</Link>
                    </div>
                    <div className="space-x-4 text-white">
                        {user!.role === 'kepegawaian' && (
                            <Link href="/siswa" className="hover:text-yellow-300">
                                Pegawai
                            </Link>
                        )}

                        {user!.role === 'atasan' && (
                            <>
                                <Link href="/kriteria" className="hover:text-yellow-300">
                                    Kriteria
                                </Link>
                                <Link href="/skala" className="hover:text-yellow-300">
                                    Skala Dasar AHP
                                </Link>
                                <Link href="/penilaian" className="hover:text-yellow-300">
                                    Nilai Awal
                                </Link>
                            </>
                        )}

                        {user!.role === 'atasan' && (
                            <div className="relative inline-block">
                                <button
                                    className="text-white hover:text-yellow-300"
                                    onClick={() => toggleDropdown(setIsPerbandinganDropdownOpen)}
                                >
                                    Perbandingan
                                </button>
                                <div
                                    className={`${
                                        isPerbandinganDropdownOpen ? 'block' : 'hidden'
                                    } dropdown-menu absolute text-gray-700 bg-white shadow-md rounded-lg w-48 mt-2`}
                                >
                                    <Link href="/perbandingan-kriteria" className="block px-4 py-2 text-sm">
                                        Kriteria
                                    </Link>
                                    <Link href="/analisa-alternatif" className="block px-4 py-2 text-sm">
                                        Alternatif
                                    </Link>
                                </div>
                            </div>
                        )}

                        {(user!.role === 'atasan' || user!.role === 'manajer') && (
                            <div className="relative inline-block">
                                <button
                                    className="text-white hover:text-yellow-300"
                                    onClick={() => toggleDropdown(setIsHasilAkhirDropdownOpen)}
                                >
                                    Hasil Akhir
                                </button>
                                <div
                                    className={`${
                                        isHasilAkhirDropdownOpen ? 'block' : 'hidden'
                                    } dropdown-menu absolute text-gray-700 bg-white shadow-md rounded-lg w-48 mt-2`}
                                >
                                    <Link href="/hasil-akhir" className="block px-4 py-2 text-sm">
                                        Hasil Akhir
                                    </Link>
                                    <Link href="/ranking" className="block px-4 py-2 text-sm">
                                        Usulan
                                    </Link>
                                </div>
                            </div>
                        )}

                        {(user!.role === 'atasan' || user!.role === 'manajer') && (
                            <div className="relative inline-block">
                                <button
                                    className="text-white hover:text-yellow-300"
                                    onClick={() => toggleDropdown(setIsLaporanDropdownOpen)}
                                >
                                    Laporan
                                </button>
                                <div
                                    className={`${
                                        isLaporanDropdownOpen ? 'block' : 'hidden'
                                    } dropdown-menu absolute text-gray-700 bg-white shadow-md rounded-lg w-48 mt-2`}
                                >
                                    <Link href="#" onClick={() => handleLaporan('siswa')}
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
                        )}

                        <div className="relative inline-block">
                            <button
                                className="text-white hover:text-yellow-300"
                                onClick={() => toggleDropdown(setIsProfileDropdownOpen)}
                            >
                                {user!.nama_lengkap}
                            </button>
                            <div
                                className={`${
                                    isProfileDropdownOpen ? 'block' : 'hidden'
                                } dropdown-menu absolute text-gray-700 bg-white shadow-md rounded-lg w-48 mt-2`}
                            >
                                <Link href="/profil" className="block px-4 py-2 text-sm">
                                    Profil
                                </Link>
                                {user!.role === 'kepegawaian' && (
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
                </div>
            </nav>
        </div>
    );
};
import { useState } from 'react';
import Link from 'next/link';

const Navbar = ({ user }: any) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isPerbandinganDropdownOpen, setIsPerbandinganDropdownOpen] = useState(false);
    const [isHasilAkhirDropdownOpen, setIsHasilAkhirDropdownOpen] = useState(false);
    const [isLaporanDropdownOpen, setIsLaporanDropdownOpen] = useState(false);

    // Toggle dropdown visibility
    const toggleDropdown = (setState: React.Dispatch<React.SetStateAction<boolean>>) => {
        setState((prevState) => !prevState);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <nav className="bg-gray-800 p-4 rounded-lg shadow-md fixed w-full top-0 left-0 z-10">
                <div className="flex items-center justify-between">
                    <div className="text-white text-2xl font-semibold">
                        <Link href="/">
                            Home
                        </Link>
                    </div>
                    <div className="space-x-4 text-white">
                        <Link href="/index" className="hover:text-yellow-300">
                            Home
                        </Link>

                        {user.role === 'kepegawaian' && (
                            <Link href="/data-alternatif" className="hover:text-yellow-300">
                                Pegawai
                            </Link>
                        )}

                        {user.role === 'atasan' && (
                            <>
                                <Link href="/data-kriteria" className="hover:text-yellow-300">
                                    Kriteria
                                </Link>
                                <Link href="/nilai" className="hover:text-yellow-300">
                                    Skala Dasar AHP
                                </Link>
                                <Link href="/nilai-awal" className="hover:text-yellow-300">
                                    Nilai Awal
                                </Link>
                            </>
                        )}

                        {user.role === 'atasan' && (
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
                                    <Link href="/analisa-kriteria" className="block px-4 py-2 text-sm">
                                        Kriteria
                                    </Link>
                                    <Link href="/analisa-alternatif" className="block px-4 py-2 text-sm">
                                        Alternatif
                                    </Link>
                                </div>
                            </div>
                        )}

                        {(user.role === 'atasan' || user.role === 'manajer') && (
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

                        {(user.role === 'atasan' || user.role === 'manajer') && (
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
                                    <Link href="/laporan-kriteria" className="block px-4 py-2 text-sm">
                                        Laporan Data Siswa
                                    </Link>
                                    <Link href="/laporan-ranking" className="block px-4 py-2 text-sm">
                                        Laporan Ranking
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div className="relative inline-block">
                            <button
                                className="text-white hover:text-yellow-300"
                                onClick={() => toggleDropdown(setIsProfileDropdownOpen)}
                            >
                                {user.nama_lengkap}
                            </button>
                            <div
                                className={`${
                                    isProfileDropdownOpen ? 'block' : 'hidden'
                                } dropdown-menu absolute text-gray-700 bg-white shadow-md rounded-lg w-48 mt-2`}
                            >
                                <Link href="/profil" className="block px-4 py-2 text-sm">
                                    Profil
                                </Link>
                                {user.role === 'kepegawaian' && (
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

            {/* Main Content */}
            <div className="mt-24">
                <h1 className="text-3xl font-semibold mb-4">Selamat datang!</h1>
                <p>Pemilihan Pegawai Terbaik</p>
            </div>
        </div>
    );
};

export default Navbar;

import { GetServerSideProps } from 'next';
import { User } from "@/types/api";
import { getUser } from "@/lib/auth";
import { NavBar, Footer } from "@/components";

const IndexPage = ({ user }: { user: User }) => {
    return (
        <div>
            <NavBar user={user} />
            <div className="container mx-auto px-4 py-8">
                <div className="bg-gray-800 text-white rounded-lg shadow-lg p-8 text-center">
                    <h1 className="text-4xl font-bold mb-2">Selamat Datang di Aplikasi AHP</h1>
                    <p className="text-lg mb-6">Pemilihan siswa terbaik SMA 5 N Kota Tegal</p>

                    <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-center mb-4">Penjelasan Skala Penilaian</h2>
                        <ul className="list-inside list-decimal space-y-2 text-left">
                            <li><strong>91-100:</strong> Sangat Baik</li>
                            <li><strong>85-90:</strong> Baik</li>
                            <li><strong>75-84:</strong> Cukup</li>
                            <li><strong>60-74:</strong> Kurang</li>
                            <li><strong>0-59:</strong> Tidak Memadai</li>
                        </ul>
                    </div>

                    <div className="bg-white text-gray-800 p-6 mt-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-center mb-4">Cara Menggunakan Aplikasi AHP</h2>
                        <ol className="list-inside list-decimal space-y-2 text-left">
                            <li>
                                <strong>Buat Skala Dasar</strong>: Di menu "Skala Dasar", tentukan skala perbandingan yang akan digunakan dalam proses AHP.
                            </li>
                            <li>
                                <strong>Buat Kriteria</strong>: Di menu "Kriteria", tentukan kriteria-kriteria yang akan digunakan untuk menilai siswa.
                            </li>
                            <li>
                                <strong>Tambahkan Data Siswa</strong>: Pastikan data siswa sudah dimasukkan. Jika belum, login menggunakan akun staff administrasi dan masuk ke menu "Siswa" untuk menambah data siswa.
                            </li>
                            <li>
                                <strong>Kalkulasi Bobot Kriteria</strong>: Setelah kriteria dan skala dasar selesai, pilih menu "Perbandingan" untuk mengkalkulasi bobot kriteria.
                            </li>
                            <li>
                                <strong>Penilaian Siswa</strong>: Setelah kriteria dan bobot perbandingan tersedia, masuk ke menu "Penilaian" untuk memberi nilai kepada siswa berdasarkan kriteria yang telah ditentukan.
                            </li>
                            <li>
                                <strong>Lihat Hasil</strong>: Setelah melakukan penilaian, hasil perhitungan AHP akan muncul secara otomatis di menu "Hasil Akhir".
                            </li>
                        </ol>
                    </div>

                    <div className="bg-white text-gray-800 p-6 mt-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-center mb-4">Proses AHP</h2>
                        <p className="text-sm text-left">
                            AHP (Analytic Hierarchy Process) adalah metode untuk mengambil keputusan berdasarkan penilaian berlapis dan perbandingan antar kriteria. Proses ini menggunakan perbandingan berpasangan untuk memberikan bobot yang lebih adil berdasarkan prioritas. Dengan menggunakan aplikasi ini, Anda dapat dengan mudah melakukan perhitungan bobot kriteria, menilai siswa, dan mendapatkan hasil akhir secara otomatis.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const [user, backToLogin] = await getUser(context);
    if (backToLogin) {
        return backToLogin;
    }
    return {
        props: { user },
    };
};

export default IndexPage;

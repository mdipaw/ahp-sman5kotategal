import {GetServerSideProps} from 'next';
import {User} from "@/types/api";
import {getUser} from "@/lib/auth";
import {NavBar, Footer} from "@/components";


const IndexPage = ({user}: { user: User }) => {
    return (
        <div>
            <NavBar user={user}/>
            <div className="container mx-auto px-4 py-8">
                <div className="jumbotron text-center bg-blue-500 text-white p-8 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold">Selamat datang!</h1>
                    <p className="mt-2">Pemilihan siswa terbaik SMA 5 N Kota Tegal</p>
                </div>

            </div>
            <Footer/>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const [user, backToLogin] = await getUser(context)
    if (backToLogin) {
        return backToLogin
    }
    return {
        props: {user}
    }
};

export default IndexPage;

import {GetServerSideProps} from 'next';

const LogoutPage = () => null

export const getServerSideProps: GetServerSideProps = async ({res}) => {
    res.setHeader('Set-Cookie', 'session=; HttpOnly; Secure; Max-Age=0; Path=/;');
    return {
        redirect: {
            destination: '/login',
            permanent: false,
        },
    };
};

export default LogoutPage;

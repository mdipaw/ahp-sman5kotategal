import jwt from "jsonwebtoken";
import {jwtVerify, JWTVerifyResult} from "jose";
import {User} from "@/types/api";
import {GetServerSidePropsContext, Redirect} from "next";


export const generateToken = (payload: any) => {
    return jwt.sign(payload, 'secret', {expiresIn: '7d'});
}

export const getUser = async (context: GetServerSidePropsContext): Promise<[User | null, { redirect: Redirect } | null]> => {
    const session = context.req.cookies['session'] || null;
    if (!session) {
        return [null, {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }];
    }
    const data = await jwtVerify(session, new TextEncoder().encode(process.env.JWT_SECRET_KEY || 'secret')) as JWTVerifyResult;
    if (!data) {
        return [null, {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }];
    }

    return [data.payload as unknown as User, null];
};
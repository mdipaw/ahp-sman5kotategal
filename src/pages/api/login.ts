'use-server'
import {createHash} from 'crypto';
import {connectDB} from "@/lib/db";
import {NextApiRequest, NextApiResponse} from "next";
import { serialize } from 'cookie';
import {generateToken} from "@/lib/auth";
import {setCookie} from "cookies-next/server";


export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(401).send({error: 'Unauthorized'});
    }
    const {username, password} = req.body as unknown as { username: string; password: string };

    try {
        const db = await connectDB();
        const [result] = await db.query<any>("SELECT * FROM pengguna WHERE username = ?", [username]);
        if (!result || result.length === 0) {
            return res.status(401).json({message: 'Username tidak ditemukan'});
        }

        const user = result[0];

        const hashedPassword = createHash('md5').update(password).digest('hex');

        if (user.password !== hashedPassword) {
            return res.status(401).json({message: 'Password salah'});
        }
        user.password = undefined;

        res.setHeader('Set-Cookie', serialize('session', generateToken(user), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        }));
        return res.status(200).json(user);
    } catch (err) {
        return res.status(400).json({message: `Failed to connect to DB: ${err}`});
    }
}

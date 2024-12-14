import {connectDB, countData, getData} from "@/lib/db";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let result;
    try {
        if (req.method === 'GET') {
            if (!req.query.type) {
                throw Error('type query is required');
            }
            result = await GET(req.query)
        }
        if (req.method === 'POST') {
            if (!req.body.type) {
                throw Error('field type is required');
            }
            result = await POST(req.body)
        }
        if (req.method === 'PUT') {
            if (!req.body.type) {
                throw Error('field type is required');
            }
            result = await PUT(req.body)
        }
        if (req.method === 'DELETE') {
            if (!req.query.type) {
                throw Error('type query is required');
            }
            result = await DELETE(req.query)
        }
    } catch (error) {
        res.status(500).json({error: `${error}`})
        return
    }
    res.status(200).json(result)
}

const GET = async (
    query: Partial<{ [key: string]: string | string[]; }>,
) => {
    let limit: number | undefined
    let offset: number | undefined
    if (query['limit']) {
        limit = parseInt(query.limit as string)
    }
    if (query['offset']) {
        offset = parseInt(query.offset as string)
    }
    const db = await connectDB();
    if (query['type'] === 'count') {
        if (!query['type_count']) {
            throw Error('type_count query is required');
        }
        return await countData(db, query['type_count'] as string)
    }
    if (query['type'] === 'siswa' || query['type'] === 'kriteria') {
        return await getData(db, query['type'], limit, offset);
    }
}

const POST = async (
    body: { [key: string]: unknown },
) => {
    if (body.type === 'kriteria') {
        if (!body.id || !body.nama) {
            throw Error('id atau nama wajib di isi');
        }
        const db = await connectDB();
        await db.query("INSERT INTO data_kriteria (id_kriteria, nama_kriteria, jumlah_kriteria, bobot_kriteria) VALUES (?, ?, 0, 0)", [body.id, body.nama])
    }
}

const PUT = async (
    body: { [key: string]: unknown },
) => {
    if (body.type === 'kriteria') {
        if (!body.id || !body.nama) {
            throw Error('id atau nama wajib di isi');
        }
        const db = await connectDB();
        await db.query("UPDATE data_kriteria SET nama_kriteria = ? WHERE id_kriteria = ?", [body.nama, body.id])
    }
}

const DELETE = async (
    query: Partial<{ [key: string]: string | string[]; }>,
) => {
    if (query['type'] === 'kriteria') {
        if (!query['ids']) {
            throw Error('ids wajib di isi');
        }
        const ids = (query['ids'] as string).split(",")
        const db = await connectDB();
        const placeholders = ids.map(() => '?').join(',');
        const q = `DELETE FROM kriteria WHERE id_kriteria IN (${placeholders})`;
        return db.query(q, ids);
    }
}

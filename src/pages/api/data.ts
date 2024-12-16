import {connectDB, countData, getData} from "@/lib/db";
import {NextApiRequest, NextApiResponse} from "next";
import {Kriteria, Student} from "@/types/api";

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
            result = await DELETE(req.query)
        }
    } catch (error) {
        res.status(500).json({error: `${error}`})
        return
    }
    res.status(200).json(result ? result : {})
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
    return await getData(db, query['type'] as string, limit, offset);

}

const POST = async (
    body: { [key: string]: unknown },
) => {
    if (body.type === 'kriteria') {
        if (!body.code || !body.name) {
            throw Error('code atau nama wajib di isi');
        }
        if (body.sum_value === undefined) {
            body.sum_value = 0;
        }
        if (body.weight_value === undefined) {
            body.weight_value = 0;
        }
        const db = await connectDB();
        return db.query("INSERT INTO kriteria (code, name, sum_value, weight_value) VALUES (?, ?, ?, ?)", [body.code, body.name, body.sum_value, body.weight_value]);
    }
    if (body.type === 'comparison') {
        if (!body.values || (body.values as unknown[]).length === 0) {
            throw Error('values wajib di isi');
        }
        const db = await connectDB();
        await db.query("DELETE FROM comparison");
        await db.query("ALTER TABLE comparison AUTO_INCREMENT = 1");
        await db.query("INSERT INTO comparison (code_kriteria_1, code_kriteria_2, value) VALUES ?", [body.values]);
        (body.sumsWeights as Array<{ code: string; sum_value: number; weight_value: number }>)?.map(async (k) => {
            return db.query("UPDATE kriteria SET sum_value = ?, weight_value = ? WHERE code = ?", [k.sum_value, k.weight_value, k.code]);
        });
    }
    if (body.type === 'scale') {
        if (!body.name || !body.value) {
            throw Error('name atau value wajib di isi');
        }
        const db = await connectDB();
        return db.query("INSERT INTO scale (value, name) VALUES (?, ?)", [body.value, body.name])
    }
    if (body.type === 'student') {
        if (!body.code || !body.name || !body.class || !body.dob || !body.gender || !body.address) {
            throw Error('id, nama, kelas, tanggal lahir, jenis kelamin, alamat, wajib di isi');
        }
        return (await connectDB()).query(`INSERT INTO student (code, name, class, dob, gender, address) VALUES (?, ?, ?, ?, ?, ?)`,
            [body.code, body.name, body.class, body.dob, body.gender, body.address],
        )
    }
    if (body.type === 'score') {
        const db = await connectDB();
        const data = body.data as { [key: string]: any };

        const [student] = await db.query("SELECT * FROM student WHERE id = ?", [data.selectedSiswa]);
        if (!student) {
            throw Error('Siswa tidak ditemukan');
        }

        const [kriteriaRows] = await db.query("SELECT * FROM kriteria WHERE code IN (?)", [
            Object.keys(data.inputAddValues).filter(key => key !== "code")
        ])

        const kriteriaData: { [key: string]: any } = {};
        const weightValues: { [key: string]: any } = {};

        (kriteriaRows as Kriteria[]).forEach((kriteria) => {
            const key = kriteria.code;
            const weight_value = kriteria.weight_value;
            const score = (data.inputAddValues as { [key: string]: any })[key];

            kriteriaData[key] = score;
            weightValues[key] = weight_value;
        });

        kriteriaData["weight_values"] = weightValues;

        const code = data.selectedCode === 'Baru' ? (data.inputAddValues).code : data.selectedCode;

        return db.query(
            `INSERT INTO score (code, student_id, data, student_name)
             VALUES (?, ?, ?, ?)`,
            [code, data.selectedSiswa, JSON.stringify(kriteriaData), (student as Student[])[0].name]
        );
    }
}

const PUT = async (
    body: { [key: string]: unknown },
) => {
    if (body.type === 'kriteria') {
        if (!body.code || !body.nama) {
            throw Error('code atau nama wajib di isi');
        }
        const db = await connectDB();
        await db.query("UPDATE kriteria SET name = ? WHERE code = ?", [body.nama, body.code])
    }
    if (body.type === 'scale') {
        if (!body.value || !body.name) {
            throw Error('value atau name wajib di isi');
        }
        const db = await connectDB();
        await db.query("UPDATE scale SET value = ?, name = ? WHERE id = ?", [body.value, body.name, body.id])
    }
    if (body.type === 'student') {
        if (!body.code || !body.name || !body.class || !body.dob || !body.gender || !body.address) {
            throw Error('id, nama, kelas, tanggal lahir, jenis kelamin, alamat, wajib di isi');
        }
        return (await connectDB()).query("UPDATE student SET name = ?, class = ?, dob = ?, gender = ?, address = ? WHERE code = ?",
            [body.name, body.class, body.dob, body.gender, body.address, body.code]
        );

    }
}

const DELETE = async (
    query: Partial<{ [key: string]: string | string[]; }>,
) => {
    if (!query['ids'] || !query['primary_column'] || !query['type']) {
        throw Error('ids atau primary_column atau wajib di isi');
    }
    const ids = (query['ids'] as string).split(",")
    const db = await connectDB();
    const placeholders = ids.map(() => '?').join(',');
    const q = `DELETE
               FROM ${query['type']}
               WHERE ${query['primary_column']} IN (${placeholders})`;
    return db.query(q, ids);
}

import {NextApiRequest, NextApiResponse} from "next";
import {connectDB} from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'GET' && req.method !== 'DELETE') {
            res.status(405).send({})
            return
        }
        if (req.method === "DELETE") {
            await (await  connectDB()).query("DELETE FROM score WHERE id = ?", [req.query.id])
            res.status(200).send({})
            return
        }

        const db = await connectDB();
        const [result] = await  db.query("SELECT * FROM score")
        const response: {[key:string]:Array<{[key:string]:any}>} = {}
        if (result as unknown as Array<{ code: string }>) {
            (result as unknown as Array<{ code: string }>).forEach((result) => {
                if (!(result.code in response)) {
                    response[result.code] = [result];
                }else{
                    response[result.code].push(result);
                }

            })
        }
        return res.status(200).json(response);

    } catch (error) {
        res.status(500).json({error: `${error}`})
    }
}
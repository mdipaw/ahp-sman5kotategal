import jwt from "jsonwebtoken";


export const generateToken = (payload: any) => {
    return jwt.sign(payload, 'secret', {expiresIn: '7d'});
}

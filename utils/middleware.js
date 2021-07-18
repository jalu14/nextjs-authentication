import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function runMiddleware(token) {
    return new Promise((resolve, reject) => {
        if (!token) return reject(false);

        try {
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    return reject(false);
                }
                return resolve(decoded);
            });
        } catch (e) {
            return reject(false);
        }
    });
}
import jwt from 'jsonwebtoken';

export class TokenUtil {
    static generateTokenFromUser(user, expiresIn = '1h') {
        delete user.password;
        return jwt.sign(
            {
                email: user.email,
                data: user.data,
                social: user.social
            },
            process.env.JWT_SECRET,
            {
                expiresIn: expiresIn
                // expiresIn: 2d // Tiempo en dias para que el token no sea válido
                // expiresIn: 10h // Tiempo en horas para que el token no sea válido
            }
        );
    }

    static async checkToken(token) {
        if (!token) return [null, { error: 'no_token' }];

        try {
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    return [null, { error: 'failed_verify' }];
                }
                return [decoded, null];
            });
        } catch (e) {
            return [null, { error: e }];
        }
    }
}

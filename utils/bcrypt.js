import bcrypt from 'bcryptjs';

export class BcryptUtil {
    static generatePassword(plainPwd) {
        if (!plainPwd) {
            return [null, { error: 'no_pwd_provided' }]
        }

        try {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(plainPwd, salt);
            return [hash, null];
        } catch (e) {
            return [null, e];
        }
    }

    static checkPassword(pwdToCheck, hashPwd) {
        if (!pwdToCheck || !hashPwd) {
            return [null, { error: 'no_pwd_provided' }]
        }
        try {
            // const salt = hashPwd.split(' ')[0];
            // const hash = bcrypt.hashSync(pwdToCheck, salt);
            const isEqual = bcrypt.compareSync(pwdToCheck, hashPwd);
            return [isEqual, null];
        } catch (e) {
            return [null, e];
        }
    }
}
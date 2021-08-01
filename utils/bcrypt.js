import bcrypt from 'bcryptjs';

export function checkPassword(pwdToCheck, hashPwd) {
    if (!pwdToCheck || hashPwd) {
        return [null, {error: 'no_pwd_provided'}]
    }
    try {
        return [bcrypt.compareSync(pwdToCheck, hashPwd), null]
    } catch (e) {
        return [null, e];
    }
}
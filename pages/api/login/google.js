import { OAuth2Client } from 'google-auth-library';
import { TokenUtil } from "../../../utils/token";
import {UserService} from "../../../services/user.service";

const CLIENT = new OAuth2Client(process.env.GOOGLE_ID);

export default async function handler(req, res) {
    const { method, query } = req;
    console.log('Google login attempt with token: ' + query.token);

    switch (method) {
        case 'GET':
            const [userData, error] = await verifyToken(query.token);

            if (!userData || error) {
                return res.status(400).json({ status: 'error', data: { error: 'unauthorized' } });
            }

            const [user, userError] = await UserService.getCreateUserFromSocialEmail(userData.email, 'google');
            let token = TokenUtil.generateTokenFromUser(user);

            return res.status(200).json({ status: 'success', data: { token } });
            break;
        default:
            res.status(400).json({ status: 'error' });
            break;
    }
}

async function verifyToken(token) {
    try {
        let verifiedToken = await CLIENT.verifyIdToken({
            idToken: token,
            audience: process.env.OAUTHKEY
        });
        let data = verifiedToken.getPayload();
        return [data, null];
    } catch (e) {
        return [null, e];
    }
};
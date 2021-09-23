import * as patreon    from 'patreon';
import { TokenUtil }   from '../../../utils/token';
import { UserService } from '../../../services/user.service';

const patreonAPI = patreon.patreon;
const patreonOAuth = patreon.oauth;

const patreonClient = patreonOAuth(process.env.PATREON_ID, process.env.PATREON_SECRET);

export default async function handler(req, res) {
    const { method, query } = req;
    console.log('Patreon login attempt with code: ' + query.code);

    switch (method) {
        case 'GET':
            try {
                const [userData, error] = await getPatreonInfo(query.code);

                if (!userData || error) {
                    res.status(400).json({ status: 'error', data: { error: 'unauthorized' } });
                    return;
                }

                const [user, userError] = await UserService.getCreateUserFromSocialEmail(userData.attributes.email, 'patreon');

                let token = TokenUtil.generateTokenFromUser(user);
                res.status(200).json({ status: 'success', data: { token } });
            } catch (error) {
                res.status(400).json({ status: 'error', data: { error: 'unauthorized' } });
            }
            break;
        default:
            res.status(400).json({ status: 'error' });
            break;
    }
}

async function getPatreonInfo(code) {
    try {
        const patreonToken = await patreonClient.getTokens(code, process.env.PATREON_BACK_URL);
        const patreonAPIClient = patreonAPI(patreonToken.access_token);
        const { store } = await patreonAPIClient('/current_user');
        const data = store.findAll('user').map(user => user.serialize());
        const user = data[0].data;

        return [user, null];

    } catch (e) {
        return [null, e];
    }
}
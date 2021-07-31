import * as patreon from 'patreon';

const patreonAPI = patreon.patreon;
const patreonOAuth = patreon.oauth;

const patreonClient = patreonOAuth(process.env.PATREON_ID, process.env.PATREON_SECRET);

export default async function handler(req, res) {
    const { method, query } = req;
    console.log('Login attempt with code: ' + query.code);

    switch (method) {
        case 'GET':
            try {
                const { code } = query;
                const patreonToken = await patreonClient.getTokens(code, 'http://localhost:3000/login/patreon');
                const patreonAPIClient = patreonAPI(patreonToken.access_token);
                let { store } = await patreonAPIClient('/current_user');
                const data = store.findAll('user').map(user => user.serialize());

                if (!data || !data.length) res.status(400).json({ status: 'error', data: { error: 'unauthorized' } });

                let user = data[0].data;
                if (!user) res.status(400).json({ status: 'error', data: { error: 'unauthorized' } });

                

                const token = {};
                res.status(200).json({ status: 'success', data: { user, token } });
            } catch (error) {
                res.status(400).json({ status: 'error', data: { error: 'unauthorized' } });
            }
            break;
        default:
            res.status(400).json({ status: 'error' });
            break;
    }
}
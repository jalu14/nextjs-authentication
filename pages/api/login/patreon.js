import * as patreon from 'patreon';
import { connectToDatabase } from '../../../utils/dbConnect';
import { generateTokenFromUser } from '../../../utils/token';

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
                }

                const { db } = await connectToDatabase();
                let existingUser = await db.collection('users').findOne({ email: userData.attributes.email });

                if (!existingUser) {
                    const newUser = {
                        email: userData.attributes.email,
                        data: {},
                        social: {
                            patreon: {
                                id: userData.id,
                                email: userData.attributes.email
                            }
                        }
                    };

                    existingUser = await db.collection('users').insertOne(newUser);
                }

                if (!existingUser.social.patreon) {
                    existingUser.social.patreon = {
                        patreon: {
                            id: userData.id,
                            email: userData.attributes.email
                        }
                    }

                    db.collection('users').findOneAndUpdate(
                        { _id: existingUser._id },
                        {
                            $set: {
                                'social.patreon': {
                                    id: userData.id,
                                    email: userData.attributes.email
                                }
                            }
                        }
                    );
                }

                let token = generateTokenFromUser(existingUser);
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
        const patreonToken = await patreonClient.getTokens(code, 'http://localhost:3000/login/patreon');
        const patreonAPIClient = patreonAPI(patreonToken.access_token);
        const { store } = await patreonAPIClient('/current_user');
        const data = store.findAll('user').map(user => user.serialize());
        const user = data[0].data;

        return [user, null];

    } catch (e) {
        return [null, e];
    }
}
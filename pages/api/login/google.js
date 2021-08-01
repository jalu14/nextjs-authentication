import { OAuth2Client } from 'google-auth-library';
import { generateTokenFromUser } from "../../../utils/token";
import { connectToDatabase } from "../../../utils/dbConnect";

const GOOGLE_USER_INFO = 'https://www.googleapis.com/oauth2/v3/userinfo';
const GOOGLE_TOKEN_INFO = 'https://www.googleapis.com/oauth2/v3/tokeninfo';

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

            const { db } = await connectToDatabase();
            let existingUser = await db.collection('users').findOne({ email: userData.email });

            if (!existingUser) {
                const newUser = {
                    email: userData.email,
                    data: {},
                    social: {
                        google: {
                            email: userData.email
                        }
                    }
                };

                existingUser = await db.collection('users').insertOne(newUser);
            }



            if (!existingUser.social.google) {
                existingUser.social.google = {
                    google: {
                        email: userData.email
                    }
                }

                db.collection('users').findOneAndUpdate(
                    { _id: existingUser._id },
                    {
                        $set: {
                            'social.google': {
                                email: userData.email
                            }
                        }
                    }
                );
            }

            let token = generateTokenFromUser(existingUser);

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
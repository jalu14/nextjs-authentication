import axios from "axios";
import { generateTokenFromUser } from "../../../utils/token";
import { connectToDatabase } from "../../../utils/dbConnect";

const DISCORD_URL_TOKEN = 'https://discord.com/api/v8/oauth2/token';
const DISCORD_URL_ACCESS = 'https://discord.com/api/v6/users/@me';

export default async function handler(req, res) {
    const { method, query } = req;
    console.log('Discord login attempt with code: ' + query.code);

    switch (method) {
        case 'GET':
            const [accessToken, error] = await getOAuthToken(query.code);
            const [userData, userError] = await getDiscordInfo(accessToken);

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
                        discord: {
                            email: userData.email
                        }
                    }
                };

                existingUser = await db.collection('users').insertOne(newUser);
            }

            if (!existingUser.social.discord) {
                existingUser.social.discord = {
                    discord: {
                        email: userData.email
                    }
                }

                db.collection('users').findOneAndUpdate(
                    { _id: existingUser._id },
                    {
                        $set: {
                            'social.discord': {
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

async function getOAuthToken(code) {
    try {
        let data = await axios({
            method: 'POST',
            url: DISCORD_URL_TOKEN,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: new URLSearchParams({
                client_id: process.env.DISCORD_ID,
                client_secret: process.env.DISCORD_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: 'http://localhost:3000/login/discord',
            })
        });

        if (data.error) {
            return [null, { error: data.error, description: data.error_description }];
        }

        return [data.data.access_token, null];
    } catch (e) {
        return [null, e];
    }
};

async function getDiscordInfo(token) {
    try {
        let data = await fetch(
            DISCORD_URL_ACCESS,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                method: 'GET'
            }
        );

        data = await data.json();

        if (data.error) {
            return [null, { error: data.error, description: data.error_description }];
        }

        return [data, null];
    } catch (e) {
        return [null, e];
    }
};
import { connectToDatabase } from "../dbConnect";

export class UserData {

    static async getCreateUserFromSocialEmail(email, social) {
        if (!email) {
            return [null, { error: 'no_email' }];
        }
        if (!social) {
            return [null, { error: 'no_social' }];
        }

        try {
            const { db } = await connectToDatabase();
            let existingUser = await db.collection('users').findOne({ email: email });

            if (!existingUser) {
                const newUser = {
                    email: email,
                    data: {},
                    social: {}
                };
                newUser.social[social] = { email };

                existingUser = await db.collection('users').insertOne(newUser);
            }

            if (!existingUser.social[social]) {
                existingUser.social[social] = { email };

                db.collection('users').findOneAndUpdate(
                    { _id: existingUser._id },
                    {
                        $set: {
                            [`social.${social}`]: {
                                email: email
                            }
                        }
                    }
                );
            }

            return [existingUser, null];
        } catch (e) {
            return [null, e];
        }
    }
}
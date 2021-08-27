import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../utils/dbConnect';

export class UserService {

    static async findOne(email) {
        try {
            const { db } = await connectToDatabase();
            const user = await db.collection('users')
                .findOne({ email: email });
            return [user, null];
        } catch (e) {
            return [null, e];
        }
    }

    static async createUser(user) {
        try {
            const { db } = await connectToDatabase();
            const newUser = await db.collection('users')
                .insertOne(user);
            return [newUser, null];
        } catch (e) {
            return [null, e];
        }
    }

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

                let inserted = await db.collection('users').insertOne(newUser);

                if (!inserted || !inserted.acknowledged) {
                    return [null, { error: 'user_not_inserted' }];
                }

                existingUser = newUser;
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

    static async updateUser(user) {
        try {
            const { db } = await connectToDatabase();
            let updatedUser = await db.collection('users').findOneAndUpdate(
                { _id: new ObjectId(user._id) },
                { $set: { data: user.data } }
            );
            updatedUser = updatedUser.value;
            return [updatedUser, null];
        } catch (e) {
            return [null, e];
        }
    }

    static async deleteUser(_id) {
        try {
            const { db } = await connectToDatabase();
            await db.collection('users').findOneAndDelete(
                { _id: new ObjectId(_id) }
            );
            return [true, null];
        } catch (e) {
            return [null, e];
        }
    }
}
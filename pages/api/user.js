import {connectToDatabase} from "../../utils/db-connect";
import {runMiddleware} from "../../utils/middleware";
import {ObjectId} from "mongodb";

export default async function handler(req, res) {

    if (!req.headers['x-access-token']) {
        return res.status(301).json();
    }

    const {db} = await connectToDatabase();
    const user = await runMiddleware(req.headers['x-access-token']);
    if (!user) return res.status(301).json();

    switch (req.method) {
        case 'GET':
            let existingUser = await db.collection('users').findOne({email: user.email});
            let userToSend = {...existingUser};
            delete userToSend.password;
            return res.status(200).json({status: 'success', data: {user: userToSend}});
        case 'PUT':
            let newUser = await db.collection('users').findOneAndUpdate(
                {_id: new ObjectId(req.body._id)},
                {$set: {data: req.body.data}}
            )
            return res.status(200).json({status: 'success', data: {user: newUser}});
        default:
            return res.status(400).json({status: 'error'});
    }

}
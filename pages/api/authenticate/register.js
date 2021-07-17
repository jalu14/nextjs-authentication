import {connectToDatabase} from "../../../utils/db-connect";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(400).json({status: 'error'});
    }

    const {db} = await connectToDatabase();
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        data: {}
    };

    let createdUser = await db.collection('users').insertOne(newUser);
    console.log(createdUser);

    res.status(200).json({status: 'success'});
}
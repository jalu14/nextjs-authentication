import bcrypt from 'bcryptjs';
import { connectToDatabase } from "../../../utils/db-connect";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        // Devolvemos mensaje de error, pues solo aceptamos peticiones POST
        // OJO A no olvidar el return, si después de este res.status se envia otro
        // crearemos un fallo en la API que se quedará colgada porque intentará enviar
        // una petición ya enviada.
        return res.status(400).json({ status: 'error' });
    }

    const { db } = await connectToDatabase();

    let existingUser = await db.collection('users').findOne({ email: req.body.email });
    if (existingUser) {
        return res.status(400).json({ status: 'error', message: 'El usuario ya ha sido registrado' });
    }

    const newUser = {
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        data: {}
    };

    let createdUser = await db.collection('users').insertOne(newUser);

    return res.status(200).json({ status: 'success', data: { user: createdUser } });
}
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {connectToDatabase} from "../../../utils/db-connect";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        // Devolvemos mensaje de error, pues solo aceptamos peticiones POST
        // OJO A no olvidar el return, si después de este res.status se envia otro
        // crearemos un fallo en la API que se quedará colgada porque intentará enviar
        // una petición ya enviada.
        return res.status(400).json({status: 'error'});
    }

    const {db} = await connectToDatabase();

    let existingUser = await db.collection('users').findOne({email: req.body.email});
    if (!existingUser) {
        return res.status(400).json({status: 'error', message: 'El usuario no existe'});
    }

    let passwordsMatch = bcrypt.compareSync(req.body.password, existingUser.password);
    if (!passwordsMatch) {
        return res.status(400).json({status: 'error', message: 'La contraseña es incorrecta'});
    }

    let token = jwt.sign(
        {
            email: existingUser.email,
            data: existingUser.data
        },
        JWT_SECRET,
        {
            expiresIn: '1h' // Tiempo en segundos para que el token no sea válido
            // expiresIn: 2d // Tiempo en dias para que el token no sea válido
            // expiresIn: 10h // Tiempo en horas para que el token no sea válido
        }
    );

    return res.status(200).json({status: 'success', data: {token: token}});
}
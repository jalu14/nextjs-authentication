import { checkPassword } from "../../../utils/bcrypt";
import { connectToDatabase } from "../../../utils/dbConnect";
import { generateTokenFromUser } from '../../../utils/token';

const JWT_SECRET = process.env.JWT_SECRET;

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
    if (!existingUser) {
        return res.status(400).json({ status: 'error', message: 'El usuario no existe' });
    }

    let [passwordsMatch, error] = checkPassword(req.body.password, existingUser.password);
    if (!passwordsMatch || error) {
        return res.status(400).json({ status: 'error', message: 'La contraseña es incorrecta' });
    }

    delete existingUser.password;

    let token = generateTokenFromUser(existingUser);

    return res.status(200).json({ status: 'success', data: { token: token } });
}
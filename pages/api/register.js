import { BcryptUtil }  from '../../utils/bcrypt';
import { UserService } from '../../services/user.service';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        // Devolvemos mensaje de error, pues solo aceptamos peticiones POST
        // OJO A no olvidar el return, si después de este res.status se envia otro
        // crearemos un fallo en la API que se quedará colgada porque intentará enviar
        // una petición ya enviada.
        return res.status(400).json({status: 'error'});
    }

    let [existingUser, error] = await UserService.findOne(req.body.email);
    if (existingUser) {
        return res.status(400).json({status: 'error', message: 'Ese email ya ha sido registrado'});
    }

    const [hash, hashError] = BcryptUtil.generatePassword(req.body.password);

    if (!hash || hashError) {
        return res.status(400).json({status: 'error', message: 'Contraseña incorrecta'});
    }

    const newUser = {
        email: req.body.email,
        password: hash,
        data: {}
    };

    const [createdUser, createError] = await UserService.createUser(newUser);

    return res.status(200).json({status: 'success', data: {user: createdUser}});
}
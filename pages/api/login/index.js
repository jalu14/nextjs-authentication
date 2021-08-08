import { BcryptUtil } from '../../../utils/bcrypt';
import { TokenUtil } from '../../../utils/token';
import { UserService } from '../../../services/user.service';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        // Devolvemos mensaje de error, pues solo aceptamos peticiones POST
        // OJO A no olvidar el return, si después de este res.status se envia otro
        // crearemos un fallo en la API que se quedará colgada porque intentará enviar
        // una petición ya enviada.
        return res.status(400).json({ status: 'error' });
    }

    const [existingUser, error] = await UserService.findOne(req.body.email);
    if (!existingUser || error) {
        return res.status(400).json({ status: 'error', message: 'El usuario no existe' });
    }

    const [isEqual, passwordErorr] = BcryptUtil.checkPassword(req.body.password, existingUser.password);
    if (!isEqual || passwordErorr) {
        return res.status(400).json({ status: 'error', message: 'La contraseña es incorrecta' });
    }

    delete existingUser.password;

    let token = TokenUtil.generateTokenFromUser(existingUser);

    return res.status(200).json({ status: 'success', data: { token: token } });
}
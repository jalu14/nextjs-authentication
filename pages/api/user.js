import { runMiddleware } from '../../utils/middleware';
import { UserService }   from '../../services/user.service';

export default async function handler(req, res) {

    if (!req.headers['x-access-token']) {
        return res.status(301).json();
    }

    const user = await runMiddleware(req.headers['x-access-token']);
    if (!user) return res.status(301).json();

    switch (req.method) {
        case 'GET':
            let [foundUser, findError] = await UserService.findOne(user.email);
            delete foundUser.password;
            return res.status(200).json({status: 'success', data: {user: foundUser}});
            break;
        case 'PUT':
            const [updatedUser, updateError] = await UserService.updateUser(req.body);
            delete updatedUser.password;
            return res.status(200).json({status: 'success', data: {user: updatedUser}});
            break;
        case 'DELETE':
            await UserService.deleteUser(req.body._id);
            return res.status(200).json({status: 'success'});
            break;
        default:
            return res.status(400).json({status: 'error'});
    }

}
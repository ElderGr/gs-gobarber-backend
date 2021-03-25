import { Response, Request } from "express";
import { container } from "tsyringe";
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
    public async show(req: Request, res: Response): Promise<Response>{
        const user_id = req.user.id

        const showProfile = container.resolve(ShowProfileService);

        const user = await showProfile.execute({ user_id })


        return res.json(classToClass(user))
    }

    public async update(req: Request, res: Response): Promise<Response>{
        const { name, email, password, old_password } = req.body;
        const user_id = req.user.id

        const updateProfile = container.resolve(UpdateProfileService);

        const user = await updateProfile.execute({
            name,
            email,
            user_id,
            old_password,
            password,
        });

        return res.json(classToClass(user));
    }
}

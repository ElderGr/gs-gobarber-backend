import { Router } from 'express';
import multer from "multer";
import uploadConfig from "@config/upload";

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const usersRouter = Router();
const upload = multer(uploadConfig);
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.post('/', async (req, res) => usersController.create);

usersRouter.patch('/avatar', userAvatarController.update);

export default usersRouter;
import 'reflect-metadata';
import 'dotenv/config';

import { errors } from 'celebrate';
import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import 'express-async-errors';
import routes from './routes';
import uploadConfig from "@config/upload";
import AppError from "@shared/errors/AppError";

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(errors());

//tratativa global dos erros da aplicação
app.use((err: Error, req: Request, res: Response, _: NextFunction) =>{
    //tratativa para erros dentro da aplicação
    if( err instanceof AppError ){
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }

    //erros inesperados, que não experavamos
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    })
});

app.listen(5000, () => {
    console.log('Server started on port 5000');
});

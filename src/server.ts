import 'reflect-metadata';

import express, {Request, Response, NextFunction} from 'express';
import 'express-async-errors';
import routes from './routes';
import uploadConfig from "./config/upload";
import AppError from "./errors/AppError";

import './database';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

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

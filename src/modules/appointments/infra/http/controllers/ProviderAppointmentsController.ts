import { Request, Response } from "express";
import { container } from "tsyringe";

import ListProvidersAppointmentsService from '@modules/appointments/services/ListProvidersAppointmentsService';
import { classToClass } from 'class-transformer';

export default class ProviderAppointmentsController{
    public async index(req: Request, res: Response): Promise<Response>{
        const { day, month, year } = req.query;
        const provider_id = req.user.id

        const listProvidersAppointments = container.resolve(ListProvidersAppointmentsService);

        const appointments = await listProvidersAppointments.execute({
            provider_id,
            day: Number(day),
            month: Number(month),
            year: Number(year)
        });
        return res.json(classToClass(appointments));
    }
}

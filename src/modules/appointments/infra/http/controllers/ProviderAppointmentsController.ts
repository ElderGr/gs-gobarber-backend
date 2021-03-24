import { Request, Response } from "express";
import { container } from "tsyringe";

import ListProvidersAppointmentsService from '@modules/appointments/services/ListProvidersAppointmentsService';

export default class ProviderAppointmentsController{
    public async index(req: Request, res: Response): Promise<Response>{
        const { day, month, year } = req.body;
        const provider_id = req.user.id

        const listProvidersAppointments = container.resolve(ListProvidersAppointmentsService);

        const appointments = await listProvidersAppointments.execute({
            provider_id,
            day,
            month,
            year
        });
        return res.json(appointments);
    }
}

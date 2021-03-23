import { Request, Response } from "express";
import { container } from "tsyringe";

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailability';

export default class ProviderMonthAvailabilityController{
    public async index(req: Request, res: Response): Promise<Response>{
        const { month, year, day } = req.body
        const {provider_id} = req.params

        const listProviderDayAvailabilityService = container.resolve(ListProviderDayAvailabilityService);

        const availability = await listProviderDayAvailabilityService.execute({
            provider_id,
            month,
            day,
            year
        });

        return res.json(availability);
    }
}

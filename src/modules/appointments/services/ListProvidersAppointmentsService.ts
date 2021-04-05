import { injectable, inject } from "tsyringe";

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from "class-transformer";

interface IRequest{
    provider_id: string;
    day: number;
    month: number;
    year: number;
}


@injectable()
class ListProviderAppointmentsService{
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider
    ) {}

    public async execute({ day, month, year, provider_id }: IRequest): Promise<Appointment[]>{
        const cacheKey = `provider-appointments:${provider_id}-${year}-${month}-${day}`

        let appointments = await this.cacheProvider.recover<Appointment[]>(cacheKey)

        if(!appointments){
            appointments = await this.appointmentsRepository.findAllInDayFromProvider({
                day,
                month,
                provider_id,
                year,
            })


            await this.cacheProvider.save(
                    cacheKey,
                    classToClass(appointments)
                )
        }

        return appointments
    }
}

export default ListProviderAppointmentsService

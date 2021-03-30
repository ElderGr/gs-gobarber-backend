import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from "tsyringe";

import AppError from "@shared/errors/AppError";
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider
    ) {}

    public async execute({ date, provider_id, user_id }: IRequest): Promise<Appointment> {

        const appoitnmentDate = startOfHour(date);

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appoitnmentDate,
        );
        if (findAppointmentInSameDate) {
            throw new AppError('This appointment is already booked', 400);
        }

        if(user_id === provider_id){
            throw new AppError("You can't create an appointment with your self")
        }

        if(getHours(appoitnmentDate) < 8 || getHours(appoitnmentDate) > 17){
            throw new AppError('You can only create appointments between 8am and 5pm')
        }

        if(isBefore(appoitnmentDate, Date.now())){
            throw new AppError("You can't create an appointment on a past date")
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            user_id,
            date: appoitnmentDate,
        });

        const dateFormated = format(appoitnmentDate, "dd/MM/yyyy 'às' HH:mm'h'")

        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `Novo agendamento para dia ${dateFormated}`,
        })

        await this.cacheProvider.invalidate(`provider-appointments:${provider_id}:${format(appoitnmentDate, 'yyyy-M-d')}`)

        return appointment;
    }
}

export default CreateAppointmentService;

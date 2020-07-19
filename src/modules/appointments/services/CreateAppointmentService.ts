import { startOfHour } from 'date-fns';
import { injectable, inject } from "tsyringe";

import AppError from "@shared/errors/AppError";
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    provider_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({ date, provider_id }: IRequest): Promise<Appointment> {

        const appoitnmentDate = startOfHour(date);

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appoitnmentDate,
        );

        if (findAppointmentInSameDate) {
            throw new AppError('This appointment is already booked', 400);
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            date: appoitnmentDate,
        });

        return appointment;
    }
}

export default CreateAppointmentService;

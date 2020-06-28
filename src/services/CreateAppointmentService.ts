import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from "../errors/AppError";
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
    provider_id: string;
    date: Date;
}

class CreateAppointmentService {
    public async execute({ date, provider_id }: Request): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(
            AppointmentsRepository,
        );

        const appoitnmentDate = startOfHour(date);

        const findAppointmentInSameDate = await appointmentsRepository.findByDate(
            appoitnmentDate,
        );

        if (findAppointmentInSameDate) {
            throw new AppError('This appointment is already booked', 400);
        }

        const appointment = appointmentsRepository.create({
            provider_id,
            date: appoitnmentDate,
        });

        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;

import ListProvidersAppointmentsService from "./ListProvidersAppointmentsService";
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let listProvidersAppointmentsService: ListProvidersAppointmentsService
let fakeAppointmentsRepository: FakeAppointmentsRepository

describe('ListProviderAppointments', () =>{
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository()
        listProvidersAppointmentsService = new ListProvidersAppointmentsService(
            fakeAppointmentsRepository
        )
    })

    it('should be able to list the appointments on a specific day', async () => {
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            user_id: 'user_id',
            date: new Date(2020, 4, 20, 14, 0, 0)
        })

        const appointment2 = await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            user_id: 'user_id',
            date: new Date(2020, 4, 20, 15, 0, 0)
        })

        const appointments = await listProvidersAppointmentsService.execute({
            provider_id: 'provider_id',
            year: 2020,
            month: 5,
            day: 20
        })

        expect(appointments).toEqual([
            appointment1,
            appointment2
        ]);
    })
});

import ListProvidersAppointmentsService from "./ListProvidersAppointmentsService";
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';


let listProvidersAppointmentsService: ListProvidersAppointmentsService
let fakeAppointmentsRepository: FakeAppointmentsRepository
let fakeCacheProvider: FakeCacheProvider

describe('ListProviderAppointments', () =>{
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository()
        fakeCacheProvider = new FakeCacheProvider()
        listProvidersAppointmentsService = new ListProvidersAppointmentsService(
            fakeAppointmentsRepository,
            fakeCacheProvider
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

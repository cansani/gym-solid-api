import { afterEach, beforeEach, expect, vi } from "vitest";
import { describe, it } from "vitest";
import { CheckInService } from "./check-in";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { MoreThanOneCheckInsOnSameDayError } from "./errors/more-than-one-check-ins-on-same-day-err";
import { MaxDistanceCheckInError } from "./errors/max-distance-check-in-err";

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInService

describe("CheckIn Service", async () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInService(checkInsRepository, gymsRepository)

        await gymsRepository.create({
            id: "gym-id",
            description: "",
            latitude: -22.739692,
            longitude: -47.660755,
            name: "",
            phone: ""
        })

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("should be able to check in", async () => {
        const { checkIn } = await sut.handle({
            gymId: "gym-id",
            userId: "user-id",
            userLatitude: -22.739692,
            userLongitude: -47.660755
        })

        expect(checkIn.id).toStrictEqual(expect.any(String))
    })

    it("should not be able check in twice in the same day", async () => {
        vi.setSystemTime(new Date(2000, 1, 1, 13))

        await sut.handle({
            gymId: "gym-id",
            userId: "user-id",
            userLatitude: -22.739692,
            userLongitude: -47.660755
        })

        await expect(async () => {
            await sut.handle({
                gymId: "gym-id",
                userId: "user-id",
                userLatitude: -22.739692,
                userLongitude: -47.660755
            })
        }).rejects.toBeInstanceOf(MoreThanOneCheckInsOnSameDayError)
    })

    it("should be possible to do more than one check-in on different days", async () => {
        vi.setSystemTime(new Date(2000, 1, 1, 13))

        await sut.handle({
            gymId: "gym-id",
            userId: "1",
            userLatitude: -22.739692,
            userLongitude: -47.660755
        })

        vi.setSystemTime(new Date(2000, 1, 2, 13))

        const { checkIn } = await sut.handle({
            gymId: "gym-id",
            userId: "1",
            userLatitude: -22.739692,
            userLongitude: -47.660755
        })

        expect(checkIn.id).toStrictEqual(expect.any(String))

    })

    it("should not be able to check in on distant gym", async () => {
        await expect(async () => {
            await sut.handle({
                gymId: "gym-id",
                userId: "1",
                userLatitude: -22.680759,
                userLongitude: -47.772418
            })
        }).rejects.toBeInstanceOf(MaxDistanceCheckInError)
    })
})
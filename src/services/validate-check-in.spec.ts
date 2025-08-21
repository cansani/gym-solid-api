import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ValidateCheckInService } from "./validate-check-in";
import { ResorceNotFoundError } from "./errors/resource-not-found.err";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-err";

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInService

describe("Validate CheckIn Service", async () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new ValidateCheckInService(checkInsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("should be able to validate check in", async () => {
        const createdCheckIn = await checkInsRepository.create({
            gym_id: "gym-id",
            user_id: "user-id"
        })

        const checkIn = await sut.handle({
            checkInId: createdCheckIn.id
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
    })

    it("should not be able to validate inexistent check in", async () => {
        await expect(async () => {
            await sut.handle({
                checkInId: "inexistent-checkin-id"
            })
        }).rejects.toBeInstanceOf(ResorceNotFoundError)
    })

    it("should not be able to validate check-in after twenty minutes created", async () => {
        vi.setSystemTime(new Date(2025, 0, 1, 20, 0, 0, 0))

        const createdCheckIn = await checkInsRepository.create({
            gym_id: "gym-id-2",
            user_id: "user-id-2"
        })

        const twentyOneMinutesInMs = 1000 * 60 * 21

        vi.advanceTimersByTime(twentyOneMinutesInMs)
        
        await expect(async () => {
            await sut.handle({
                checkInId: createdCheckIn.id
            })
        }).rejects.toBeInstanceOf(LateCheckInValidationError)      
    })
})
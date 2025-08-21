import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { ResorceNotFoundError } from "./errors/resource-not-found.err";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-err";

interface ValidateCheckInRequest {
    checkInId: string
}

export class ValidateCheckInService {
    constructor(
        private checkInsRepository: CheckInsRepository
    ) {}

    async handle({ checkInId }: ValidateCheckInRequest) {
        const checkIn = await this.checkInsRepository.findById(checkInId)

        if (!checkIn) {
            throw new ResorceNotFoundError()
        }

        const distanceInMinutesFromCheckInCreation = dayjs(new Date).diff(
            checkIn.created_at,
            "minutes"
        )

        if (distanceInMinutesFromCheckInCreation > 20) {
            throw new LateCheckInValidationError()
        }

        checkIn.validated_at = new Date()

        await this.checkInsRepository.save(checkIn)

        return checkIn
    }
}
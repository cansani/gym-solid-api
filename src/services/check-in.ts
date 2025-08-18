import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { CheckIn } from "generated/prisma";

interface CheckInRequest {
    gymId: string,
    userId: string
}

interface CheckInResponse {
    checkIn: CheckIn
}

export class CheckInService {
    constructor(
        private checkInRepository: CheckInsRepository 
    ) {}

    async handle({ gymId, userId }: CheckInRequest): Promise<CheckInResponse> {
        const checkIn = await this.checkInRepository.create({
            gym_id: gymId,
            user_id: userId,
        })

        return {
            checkIn
        }
    }
}
import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "generated/prisma";

interface FetchNearbyGymsRequest {
    userLatitude: number
    userLongitude: number
}

interface FetchNearbyGymsResponse {
    gyms: Gym[]
}

export class FetchNearbyGymsService {
    constructor(
        private gymsRepository: GymsRepository
    ) {}

    async handle({ userLatitude, userLongitude }: FetchNearbyGymsRequest): Promise<FetchNearbyGymsResponse> {
        const gyms = await this.gymsRepository.findManyNearby(userLatitude, userLongitude)

        return {
            gyms
        }
    }
}
import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "generated/prisma";

interface CreateGymRequest {
    name: string
    description: string | null
    phone: string | null
    latitude: number
    longitude: number
}

interface CreateGymResponse {
    gym: Gym
}

export class createGymService {
    constructor(
        private gymsRepository: GymsRepository
    ) {}

    async handle({ latitude, longitude, name, phone, description }: CreateGymRequest): Promise<CreateGymResponse> {
        const gym = await this.gymsRepository.create({
            name,
            description,
            phone,
            latitude,
            longitude
        })

        return {
            gym
        }
    }
}
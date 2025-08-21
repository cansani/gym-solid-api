import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "generated/prisma";

interface SearchGymsRequest {
    query: string
    page: number
}

interface SearchGymsResponse {
    gyms: Gym[]
}

export class SearchGymsService {
    constructor(
        private gymsRepository: GymsRepository
    ) {}

    async handle({ page, query }: SearchGymsRequest): Promise<SearchGymsResponse> {
        const gyms = await this.gymsRepository.searchMany(query, page)

        return {
            gyms
        }
    }
}
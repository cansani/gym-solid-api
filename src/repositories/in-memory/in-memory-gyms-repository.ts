import { Gym, Prisma } from "generated/prisma";
import { GymsRepository } from "../gyms-repository";
import { randomUUID } from "node:crypto";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

export class InMemoryGymsRepository implements GymsRepository {
    public items: Gym[] = []

    async findManyNearby(latitude: number, longitude: number): Promise<Gym[]> {
        return this.items.filter(gym => {
            const distance = getDistanceBetweenCoordinates(
                { latitude: latitude, longitude: longitude },
                { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
            )

            return distance < 10 //km
        })
    }

    async searchMany(query: string, page: number): Promise<Gym[]> {
        return this.items.filter((gym) => gym.name.includes(query)).slice((page - 1) * 20, page * 20)
    }

    async create(data: Prisma.GymCreateInput): Promise<Gym> {
        const gym = {
            id: data.id ?? randomUUID(),
            name: data.name,
            description: data.description ?? null,
            phone: data.phone ?? null,
            latitude: Prisma.Decimal(data.latitude.toString()),
            longitude: Prisma.Decimal(data.longitude.toString())
        }
        
        this.items.push(gym)    

        return gym
    }
    
    async findById(gymId: string): Promise<Gym | null> {
        const gym = this.items.find(gym => gymId === gym.id)

        if (!gym) {
            return null
        }

        return gym
    }
}
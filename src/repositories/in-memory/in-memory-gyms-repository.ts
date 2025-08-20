import { Gym, Prisma } from "generated/prisma";
import { GymsRepository } from "../gyms-repository";
import { randomUUID } from "node:crypto";

export class InMemoryGymsRepository implements GymsRepository {
    public items: Gym[] = []

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
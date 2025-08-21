import { Prisma, CheckIn } from "generated/prisma";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
    public items: CheckIn[] = []
    
    async save(checkIn: CheckIn): Promise<CheckIn> {
        const checkInIndex = this.items.findIndex(item => item.id === checkIn.id)

        if (checkInIndex >= 0) {
            this.items[checkInIndex] = checkIn
        }

        return checkIn
    }

    async findById(id: string) {
        const checkIn = this.items.find(item => item.id === id)

        if (!checkIn) {
            return null
        }

        return checkIn
    }

    async countByUserId(userId: string): Promise<number> {
        return this.items.filter(checkIn => checkIn.user_id === userId).length
    }

    async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
        const checkIns = this.items.filter((checkIn) => {
            return userId === checkIn.user_id
        }).slice((page - 1) * 20, page * 20)

        return checkIns
    }

    async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
        const startOfTheDay = dayjs(date).startOf("date")
        const endOfTheDay = dayjs(date).endOf("date")

        const checkInOnSameDay = this.items.find((checkIn) => {
            const checkInDate = dayjs(checkIn.created_at)
            const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

            return userId === checkIn.user_id && isOnSameDate
        })

        if (!checkInOnSameDay) {
            return null
        }

        return checkInOnSameDay
    }

    async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
        const checkIn = {
            id: randomUUID(),
            created_at: new Date(),
            gym_id: data.gym_id,
            user_id: data.user_id,
            validated_at: data.validated_at ? new Date(data.validated_at) : null
        }

        this.items.push(checkIn)

        return checkIn
    }
}
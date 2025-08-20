import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { ResorceNotFoundError } from "@/services/errors/resource-not-found.err"
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { MaxDistanceCheckInError } from "./errors/max-distance-check-in-err";
import { MoreThanOneCheckInsOnSameDayError } from "./errors/more-than-one-check-ins-on-same-day-err";

interface CheckInRequest {
    gymId: string
    userId: string
    userLatitude: number
    userLongitude: number
}


export class CheckInService {
    constructor(
        private checkInRepository: CheckInsRepository,
        private gymsRepository: GymsRepository
    ) {}

    async handle({ gymId, userId, userLatitude, userLongitude }: CheckInRequest) {
        const gym = await this.gymsRepository.findById(gymId)

        if (!gym) {
            throw new ResorceNotFoundError()
        }

        const distance = getDistanceBetweenCoordinates(
            { latitude: userLatitude, longitude: userLongitude },
            { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
        )

        const MAX_DISTANCE_IN_KILOMETERS = 0.1

        if (distance > MAX_DISTANCE_IN_KILOMETERS) {
            throw new MaxDistanceCheckInError()
        }

        const checkInsOnSameDay = await this.checkInRepository.findByUserIdOnDate(userId, new Date())

        if (checkInsOnSameDay) {
            throw new MoreThanOneCheckInsOnSameDayError()
        }

        const checkIn = await this.checkInRepository.create({
            gym_id: gymId,
            user_id: userId,
        })
        
        return {
            checkIn
        }
    }
}
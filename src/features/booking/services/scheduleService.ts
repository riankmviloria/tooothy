import {
    doc,
    onSnapshot,
} from 'firebase/firestore'

import { db } from '../../../lib/firebase'

export type SchedulePeriod = {
    startTime: string
    endTime: string
}

export type DaySchedule = {
    enabled: boolean
    periods: SchedulePeriod[]
}

export type WeeklySchedule = {
    monday: DaySchedule
    tuesday: DaySchedule
    wednesday: DaySchedule
    thursday: DaySchedule
    friday: DaySchedule
    saturday: DaySchedule
    sunday: DaySchedule
}

const scheduleRef =
    doc(
        db,
        'clinic_settings',
        'schedule',
    )

export function subscribeToSchedule(
    onUpdate: (
        schedule: WeeklySchedule,
    ) => void,
    onError: (
        error: Error,
    ) => void,
) {
    return onSnapshot(
        scheduleRef,
        (snapshot) => {
            if (!snapshot.exists()) {
                onUpdate({
                    monday: {
                        enabled: false,
                        periods: [],
                    },
                    tuesday: {
                        enabled: false,
                        periods: [],
                    },
                    wednesday: {
                        enabled: false,
                        periods: [],
                    },
                    thursday: {
                        enabled: false,
                        periods: [],
                    },
                    friday: {
                        enabled: false,
                        periods: [],
                    },
                    saturday: {
                        enabled: false,
                        periods: [],
                    },
                    sunday: {
                        enabled: false,
                        periods: [],
                    },
                })

                return
            }

            const data =
                snapshot.data()

            onUpdate(
                data as WeeklySchedule,
            )
        },
        (error) => {
            console.error(
                'Schedule listener failed:',
                error,
            )

            onError(error)
        },
    )
}
import {
    doc,
    onSnapshot,
    serverTimestamp,
    setDoc,
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

/*
 * DEFAULT SCHEDULE
 *
 * Used only when no schedule has been
 * configured in Firestore yet.
 */
export const defaultSchedule:
    WeeklySchedule = {
    monday: {
        enabled: true,
        periods: [
            {
                startTime: '09:00',
                endTime: '12:00',
            },
            {
                startTime: '13:00',
                endTime: '17:00',
            },
        ],
    },

    tuesday: {
        enabled: true,
        periods: [
            {
                startTime: '09:00',
                endTime: '12:00',
            },
            {
                startTime: '13:00',
                endTime: '17:00',
            },
        ],
    },

    wednesday: {
        enabled: true,
        periods: [
            {
                startTime: '09:00',
                endTime: '12:00',
            },
            {
                startTime: '13:00',
                endTime: '17:00',
            },
        ],
    },

    thursday: {
        enabled: true,
        periods: [
            {
                startTime: '09:00',
                endTime: '12:00',
            },
            {
                startTime: '13:00',
                endTime: '17:00',
            },
        ],
    },

    friday: {
        enabled: true,
        periods: [
            {
                startTime: '09:00',
                endTime: '12:00',
            },
            {
                startTime: '13:00',
                endTime: '17:00',
            },
        ],
    },

    saturday: {
        enabled: true,
        periods: [
            {
                startTime: '09:00',
                endTime: '13:00',
            },
        ],
    },

    sunday: {
        enabled: false,
        periods: [],
    },
}

/*
 * REALTIME SCHEDULE LISTENER
 */
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
                onUpdate(
                    defaultSchedule,
                )

                return
            }

            const data =
                snapshot.data()

            onUpdate(
                mergeSchedule(
                    data,
                ),
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

/*
 * SAVE WEEKLY SCHEDULE
 */
export async function saveSchedule(
    schedule: WeeklySchedule,
) {
    validateSchedule(
        schedule,
    )

    await setDoc(
        scheduleRef,
        {
            ...schedule,
            updatedAt:
                serverTimestamp(),
        },
    )
}

/*
 * MERGE FIRESTORE DATA WITH DEFAULTS
 *
 * This protects the UI if some days or
 * properties are missing.
 */
function mergeSchedule(
    data: Record<string, unknown>,
): WeeklySchedule {
    const days = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
    ] as const

    const result = {
        ...defaultSchedule,
    }

    for (const day of days) {
        const value =
            data[day] as
                | Partial<DaySchedule>
                | undefined

        if (!value) {
            continue
        }

        result[day] = {
            enabled:
                value.enabled ??
                defaultSchedule[
                    day
                ].enabled,

            periods:
                Array.isArray(
                    value.periods,
                )
                    ? value.periods.map(
                          (
                              period,
                          ) => ({
                              startTime:
                                  String(
                                      period.startTime ??
                                          '',
                                  ),
                              endTime:
                                  String(
                                      period.endTime ??
                                          '',
                                  ),
                          }),
                      )
                    : defaultSchedule[
                          day
                      ].periods,
        }
    }

    return result
}

/*
 * VALIDATE SCHEDULE
 */
function validateSchedule(
    schedule: WeeklySchedule,
) {
    const days: Array<
        keyof WeeklySchedule
    > = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
    ]

    for (const day of days) {
        const daySchedule =
            schedule[day]

        if (
            !daySchedule.enabled
        ) {
            continue
        }

        if (
            daySchedule.periods.length ===
            0
        ) {
            throw new Error(
                `${capitalize(day)} is enabled but has no operating hours.`,
            )
        }

        for (const period of daySchedule.periods) {
            if (
                !period.startTime ||
                !period.endTime
            ) {
                throw new Error(
                    `${capitalize(day)} has an incomplete operating period.`,
                )
            }

            if (
                period.startTime >=
                period.endTime
            ) {
                throw new Error(
                    `${capitalize(day)} has an invalid time range.`,
                )
            }
        }
    }
}

function capitalize(
    value: string,
) {
    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    )
}
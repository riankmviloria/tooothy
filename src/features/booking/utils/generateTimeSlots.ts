import type { TimeSlot } from '../types/booking.types'

import type {
    DaySchedule,
} from '../services/scheduleService'

const SLOT_INTERVAL_MINUTES = 30

export function generateTimeSlots(
    daySchedule: DaySchedule | null,
): TimeSlot[] {
    if (
        !daySchedule ||
        !daySchedule.enabled
    ) {
        return []
    }

    const slots: TimeSlot[] = []

    for (const period of daySchedule.periods) {
        const start =
            timeToMinutes(
                period.startTime,
            )

        const end =
            timeToMinutes(
                period.endTime,
            )

        if (
            start === null ||
            end === null ||
            start >= end
        ) {
            continue
        }

        for (
            let minutes = start;
            minutes + SLOT_INTERVAL_MINUTES <=
            end;
            minutes +=
                SLOT_INTERVAL_MINUTES
        ) {
            slots.push({
                time:
                    minutesToDisplayTime(
                        minutes,
                    ),
                available: true,
            })
        }
    }

    return slots
}

function timeToMinutes(
    value: string,
): number | null {
    const parts =
        value.split(':')

    if (
        parts.length !== 2
    ) {
        return null
    }

    const hours =
        Number(parts[0])

    const minutes =
        Number(parts[1])

    if (
        !Number.isInteger(
            hours,
        ) ||
        !Number.isInteger(
            minutes,
        ) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
    ) {
        return null
    }

    return (
        hours * 60 +
        minutes
    )
}

function minutesToDisplayTime(
    minutes: number,
): string {
    const hours24 =
        Math.floor(
            minutes / 60,
        )

    const minutesValue =
        minutes % 60

    const period =
        hours24 >= 12
            ? 'PM'
            : 'AM'

    const hours12 =
        hours24 % 12 || 12

    return `${hours12}:${String(
        minutesValue,
    ).padStart(2, '0')} ${period}`
}
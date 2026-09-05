import {
    collection,
    doc,
    runTransaction,
    serverTimestamp,
} from 'firebase/firestore'

import { db } from '../../../lib/firebase'

import type {
    Booking,
} from '../types/booking.types'

import {
    generateTrackingToken,
} from '../utils/generateTrackingToken'

import {
    generateAppointmentNumber,
} from '../utils/generateAppointmentNumber'

type SchedulePeriod = {
    startTime: string
    endTime: string
}

type DaySchedule = {
    enabled: boolean
    periods: SchedulePeriod[]
}

type WeeklySchedule = {
    monday: DaySchedule
    tuesday: DaySchedule
    wednesday: DaySchedule
    thursday: DaySchedule
    friday: DaySchedule
    saturday: DaySchedule
    sunday: DaySchedule
}

const DEFAULT_DAY_SCHEDULE:
    DaySchedule = {
    enabled: false,
    periods: [],
}

const DEFAULT_SCHEDULE:
    WeeklySchedule = {
    monday: DEFAULT_DAY_SCHEDULE,
    tuesday: DEFAULT_DAY_SCHEDULE,
    wednesday: DEFAULT_DAY_SCHEDULE,
    thursday: DEFAULT_DAY_SCHEDULE,
    friday: DEFAULT_DAY_SCHEDULE,
    saturday: DEFAULT_DAY_SCHEDULE,
    sunday: DEFAULT_DAY_SCHEDULE,
}

export type CreateAppointmentResult = {
    appointmentId: string
    appointmentNumber: string
    trackingToken: string
}

export async function createAppointment(
    booking: Booking,
): Promise<CreateAppointmentResult> {
    // ---------------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------------

    if (!booking.service) {
        throw new Error(
            'Service is required.',
        )
    }

    if (!booking.date) {
        throw new Error(
            'Date is required.',
        )
    }

    if (!booking.time) {
        throw new Error(
            'Time is required.',
        )
    }

    if (
        !booking.patient.fullName.trim()
    ) {
        throw new Error(
            'Full name is required.',
        )
    }

    if (
        !booking.patient.phone.trim()
    ) {
        throw new Error(
            'Phone number is required.',
        )
    }

    if (
        !booking.patient.email.trim()
    ) {
        throw new Error(
            'Email address is required.',
        )
    }

    // ---------------------------------------------------------
    // BOOKING DATA
    // ---------------------------------------------------------

    const service =
        booking.service

    const date =
        booking.date

    const time =
        booking.time

    // ---------------------------------------------------------
    // APPOINTMENT IDENTIFIERS
    // ---------------------------------------------------------

    const appointmentRef =
        doc(
            collection(
                db,
                'appointments',
            ),
        )

    const appointmentNumber =
        generateAppointmentNumber()

    const trackingToken =
        generateTrackingToken()

    const trackingRef =
        doc(
            db,
            'appointment_tracking',
            trackingToken,
        )

    // ---------------------------------------------------------
    // APPOINTMENT SLOT
    // ---------------------------------------------------------

    const slotId =
        `${date}_${time
            .replace(/\s+/g, '')
            .replace(/:/g, '')}`

    const slotRef =
        doc(
            db,
            'appointment_slots',
            slotId,
        )

    // ---------------------------------------------------------
    // BLOCKED DATE
    // ---------------------------------------------------------

    const blockedDateRef =
        doc(
            db,
            'blocked_dates',
            date,
        )

    // ---------------------------------------------------------
    // CLINIC SCHEDULE
    // ---------------------------------------------------------

    const scheduleRef =
        doc(
            db,
            'clinic_settings',
            'schedule',
        )

    // ---------------------------------------------------------
    // TRANSACTION
    // ---------------------------------------------------------

    await runTransaction(
        db,
        async (transaction) => {
            const [
                slotSnapshot,
                blockedDateSnapshot,
                scheduleSnapshot,
            ] =
                await Promise.all([
                    transaction.get(
                        slotRef,
                    ),

                    transaction.get(
                        blockedDateRef,
                    ),

                    transaction.get(
                        scheduleRef,
                    ),
                ])

            // -------------------------------------------------
            // CHECK SLOT
            // -------------------------------------------------

            if (
                slotSnapshot.exists()
            ) {
                throw new Error(
                    'This appointment time is no longer available. Please choose another time.',
                )
            }

            // -------------------------------------------------
            // CHECK BLOCKED DATE
            // -------------------------------------------------

            if (
                blockedDateSnapshot.exists()
            ) {
                const blockedDate =
                    blockedDateSnapshot.data()

                const reason =
                    blockedDate.reason

                if (
                    typeof reason ===
                        'string' &&
                    reason.trim()
                ) {
                    throw new Error(
                        `The clinic is closed on this date: ${reason}`,
                    )
                }

                throw new Error(
                    'The clinic is closed on this date. Please choose another date.',
                )
            }

            // -------------------------------------------------
            // LOAD SCHEDULE
            // -------------------------------------------------

            const schedule =
                scheduleSnapshot.exists()
                    ? normalizeSchedule(
                          scheduleSnapshot.data(),
                      )
                    : DEFAULT_SCHEDULE

            const dayKey =
                getDayKey(date)

            const daySchedule =
                schedule[dayKey]

            // -------------------------------------------------
            // CHECK DAY
            // -------------------------------------------------

            if (
                !daySchedule.enabled
            ) {
                throw new Error(
                    'The clinic is closed on the selected date. Please choose another date.',
                )
            }

            // -------------------------------------------------
            // CHECK TIME FORMAT
            // -------------------------------------------------

            const selectedMinutes =
                displayTimeToMinutes(
                    time,
                )

            if (
                selectedMinutes ===
                null
            ) {
                throw new Error(
                    'The selected appointment time is invalid.',
                )
            }

            // -------------------------------------------------
            // CHECK OPERATING HOURS
            // -------------------------------------------------

            const isWithinSchedule =
                daySchedule.periods.some(
                    (period) => {
                        const start =
                            timeToMinutes(
                                period.startTime,
                            )

                        const end =
                            timeToMinutes(
                                period.endTime,
                            )

                        if (
                            start ===
                                null ||
                            end ===
                                null
                        ) {
                            return false
                        }

                        return (
                            selectedMinutes >=
                                start &&
                            selectedMinutes <
                                end
                        )
                    },
                )

            if (
                !isWithinSchedule
            ) {
                throw new Error(
                    'The selected appointment time is outside clinic operating hours. Please choose another time.',
                )
            }

            // -------------------------------------------------
            // CREATE SLOT
            // -------------------------------------------------

            transaction.set(
                slotRef,
                {
                    date,

                    time,

                    appointmentId:
                        appointmentRef.id,

                    createdAt:
                        serverTimestamp(),
                },
            )

            // -------------------------------------------------
            // CREATE APPOINTMENT
            // -------------------------------------------------

            transaction.set(
                appointmentRef,
                {
                    appointmentNumber,

                    trackingToken,

                    serviceId:
                        service.id,

                    serviceName:
                        service.name,

                    duration:
                        service.duration,

                    price:
                        service.price,

                    priceLabel:
                        service.priceLabel,

                    date,

                    time,

                    patient: {
                        fullName:
                            booking.patient.fullName.trim(),

                        phone:
                            booking.patient.phone.trim(),

                        email:
                            booking.patient.email.trim(),

                        notes:
                            booking.patient.notes.trim(),
                    },

                    status:
                        'pending',

                    createdAt:
                        serverTimestamp(),
                },
            )

            // -------------------------------------------------
            // CREATE PATIENT TRACKING RECORD
            // -------------------------------------------------

            transaction.set(
                trackingRef,
                {
                    appointmentNumber,

                    serviceName:
                        service.name,

                    duration:
                        service.duration,

                    price:
                        service.price,

                    priceLabel:
                        service.priceLabel,

                    date,

                    time,

                    status:
                        'pending',

                    cancellationReason:
                        null,

                    updatedAt:
                        serverTimestamp(),
                },
            )
        },
    )

    // ---------------------------------------------------------
    // RETURN BOOKING INFORMATION
    // ---------------------------------------------------------

    return {
        appointmentId:
            appointmentRef.id,

        appointmentNumber,

        trackingToken,
    }
}

// =============================================================
// DAY KEY
// =============================================================

function getDayKey(
    date: string,
): keyof WeeklySchedule {
    const day =
        new Date(
            `${date}T00:00:00`,
        ).getDay()

    const dayKeys: Array<
        keyof WeeklySchedule
    > = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ]

    return dayKeys[day]
}

// =============================================================
// TIME → MINUTES
// =============================================================

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

// =============================================================
// DISPLAY TIME → MINUTES
// =============================================================

function displayTimeToMinutes(
    value: string,
): number | null {
    const match =
        value.match(
            /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i,
        )

    if (!match) {
        return null
    }

    let hours =
        Number(match[1])

    const minutes =
        Number(match[2])

    const period =
        match[3].toUpperCase()

    if (
        hours < 1 ||
        hours > 12 ||
        minutes < 0 ||
        minutes > 59
    ) {
        return null
    }

    if (
        period === 'AM'
    ) {
        if (hours === 12) {
            hours = 0
        }
    } else {
        if (hours !== 12) {
            hours += 12
        }
    }

    return (
        hours * 60 +
        minutes
    )
}

// =============================================================
// NORMALIZE SCHEDULE
// =============================================================

function normalizeSchedule(
    data: Record<string, unknown>,
): WeeklySchedule {
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

    const result =
        {} as WeeklySchedule

    for (const day of days) {
        const rawDay =
            data[day] as
                | {
                      enabled?: unknown
                      periods?: unknown
                  }
                | undefined

        if (!rawDay) {
            result[day] =
                DEFAULT_DAY_SCHEDULE

            continue
        }

        const periods =
            Array.isArray(
                rawDay.periods,
            )
                ? rawDay.periods
                      .map(
                          (period) => {
                              const value =
                                  period as {
                                      startTime?: unknown
                                      endTime?: unknown
                                  }

                              return {
                                  startTime:
                                      typeof value.startTime ===
                                      'string'
                                          ? value.startTime
                                          : '',

                                  endTime:
                                      typeof value.endTime ===
                                      'string'
                                          ? value.endTime
                                          : '',
                              }
                          },
                      )
                      .filter(
                          (period) =>
                              period.startTime !==
                                  '' &&
                              period.endTime !==
                                  '',
                      )
                : []

        result[day] = {
            enabled:
                rawDay.enabled ===
                true,

            periods,
        }
    }

    return result
}
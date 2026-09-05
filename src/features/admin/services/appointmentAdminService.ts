import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    runTransaction,
    serverTimestamp,
} from 'firebase/firestore'

import { db } from '../../../lib/firebase'

export type AppointmentStatus =
    | 'pending'
    | 'confirmed'
    | 'completed'
    | 'cancelled'

export type AdminAppointment = {
    id: string
    serviceId: number
    serviceName: string
    duration: number
    price: number
    date: string
    time: string
    patient: {
        fullName: string
        phone: string
        email: string
        notes: string
    }
    status: AppointmentStatus
}

export function subscribeToAppointments(
    onUpdate: (
        appointments: AdminAppointment[],
    ) => void,
    onError: (
        error: Error,
    ) => void,
) {
    const appointmentsQuery =
        query(
            collection(
                db,
                'appointments',
            ),
            orderBy(
                'date',
                'asc',
            ),
        )

    return onSnapshot(
        appointmentsQuery,
        (snapshot) => {
            const appointments =
                snapshot.docs.map(
                    (document) => {
                        const data =
                            document.data()

                        return {
                            id: document.id,

                            serviceId:
                                data.serviceId,

                            serviceName:
                                data.serviceName ??
                                '',

                            duration:
                                data.duration ??
                                0,

                            price:
                                data.price ??
                                0,

                            date:
                                data.date ??
                                '',

                            time:
                                data.time ??
                                '',

                            patient: {
                                fullName:
                                    data.patient
                                        ?.fullName ??
                                    '',

                                phone:
                                    data.patient
                                        ?.phone ??
                                    '',

                                email:
                                    data.patient
                                        ?.email ??
                                    '',

                                notes:
                                    data.patient
                                        ?.notes ??
                                    '',
                            },

                            status:
                                normalizeStatus(
                                    data.status,
                                ),
                        }
                    },
                )

            onUpdate(
                appointments,
            )
        },
        (error) => {
            console.error(
                'Appointments realtime listener failed:',
                error,
            )

            onError(error)
        },
    )
}

/*
 * UPDATE APPOINTMENT STATUS
 *
 * Valid transitions:
 *
 * pending
 *   ├── confirmed
 *   └── cancelled
 *
 * confirmed
 *   ├── completed
 *   └── cancelled
 *
 * cancelled
 *   └── pending
 *
 * completed
 *   └── no further changes
 *
 * The appointment_tracking document is
 * synchronized inside the same transaction.
 */
export async function updateAppointmentStatus(
    appointmentId: string,
    newStatus: AppointmentStatus,
    cancellationReason?: string,
) {
    if (!appointmentId) {
        throw new Error(
            'Appointment ID is required.',
        )
    }

    const appointmentRef =
        doc(
            db,
            'appointments',
            appointmentId,
        )

    await runTransaction(
        db,
        async (transaction) => {
            /*
             * READ APPOINTMENT
             */
            const appointmentSnapshot =
                await transaction.get(
                    appointmentRef,
                )

            if (
                !appointmentSnapshot.exists()
            ) {
                throw new Error(
                    'Appointment not found.',
                )
            }

            const appointment =
                appointmentSnapshot.data()

            const currentStatus =
                normalizeStatus(
                    appointment.status,
                )

            /*
             * VALIDATE TRANSITION
             */
            if (
                !isValidTransition(
                    currentStatus,
                    newStatus,
                )
            ) {
                throw new Error(
                    `Cannot change appointment from ${formatStatus(
                        currentStatus,
                    )} to ${formatStatus(
                        newStatus,
                    )}.`,
                )
            }

            const date =
                appointment.date

            const time =
                appointment.time

            if (!date || !time) {
                throw new Error(
                    'Appointment date or time is missing.',
                )
            }

            /*
             * TRACKING TOKEN
             *
             * Older appointments may not have
             * a tracking token. Those appointments
             * will continue to work normally, but
             * there will be no tracking document
             * to synchronize.
             */
            const trackingToken =
                typeof appointment.trackingToken ===
                'string'
                    ? appointment.trackingToken.trim()
                    : ''

            const trackingRef =
                trackingToken
                    ? doc(
                          db,
                          'appointment_tracking',
                          trackingToken,
                      )
                    : null

            /*
             * APPOINTMENT SLOT
             */
            const slotId =
                `${date}_${time
                    .replace(
                        /\s+/g,
                        '',
                    )
                    .replace(
                        /:/g,
                        '',
                    )}`

            const slotRef =
                doc(
                    db,
                    'appointment_slots',
                    slotId,
                )

            /*
             * READ TRACKING DOCUMENT
             *
             * This must happen before any writes
             * because this operation is inside a
             * Firestore transaction.
             */
            let trackingSnapshot = null

            if (trackingRef) {
                trackingSnapshot =
                    await transaction.get(
                        trackingRef,
                    )
            }

            /*
             * CANCEL
             *
             * Release the appointment slot.
             */
            if (
                newStatus ===
                'cancelled'
            ) {
                const slotSnapshot =
                    await transaction.get(
                        slotRef,
                    )

                const normalizedReason =
                    cancellationReason?.trim() ||
                    null

                transaction.update(
                    appointmentRef,
                    {
                        status:
                            'cancelled',

                        cancellationReason:
                            normalizedReason,

                        updatedAt:
                            serverTimestamp(),
                    },
                )

                /*
                 * Only delete the slot if
                 * it belongs to this appointment.
                 */
                if (
                    slotSnapshot.exists()
                ) {
                    const slot =
                        slotSnapshot.data()

                    if (
                        slot.appointmentId ===
                        appointmentId
                    ) {
                        transaction.delete(
                            slotRef,
                        )
                    }
                }

                /*
                 * Synchronize patient tracking.
                 */
                if (
                    trackingRef &&
                    trackingSnapshot?.exists()
                ) {
                    transaction.update(
                        trackingRef,
                        {
                            status:
                                'cancelled',

                            cancellationReason:
                                normalizedReason,

                            updatedAt:
                                serverTimestamp(),
                        },
                    )
                }

                return
            }

            /*
             * REOPEN CANCELLED APPOINTMENT
             *
             * Restore the slot only if it
             * is still available.
             */
            if (
                currentStatus ===
                    'cancelled' &&
                newStatus ===
                    'pending'
            ) {
                const slotSnapshot =
                    await transaction.get(
                        slotRef,
                    )

                if (
                    slotSnapshot.exists()
                ) {
                    throw new Error(
                        'This appointment time has already been booked by another patient.',
                    )
                }

                /*
                 * Check if the date has been
                 * blocked since cancellation.
                 */
                const blockedDateRef =
                    doc(
                        db,
                        'blocked_dates',
                        date,
                    )

                const blockedDateSnapshot =
                    await transaction.get(
                        blockedDateRef,
                    )

                if (
                    blockedDateSnapshot.exists()
                ) {
                    throw new Error(
                        'This appointment date is currently blocked.',
                    )
                }

                transaction.set(
                    slotRef,
                    {
                        date,
                        time,
                        appointmentId,
                        createdAt:
                            serverTimestamp(),
                    },
                )

                /*
                 * Synchronize patient tracking.
                 *
                 * Reopening resets the cancellation
                 * reason because the appointment is
                 * pending again.
                 */
                if (
                    trackingRef &&
                    trackingSnapshot?.exists()
                ) {
                    transaction.update(
                        trackingRef,
                        {
                            status:
                                'pending',

                            cancellationReason:
                                null,

                            updatedAt:
                                serverTimestamp(),
                        },
                    )
                }
            }

            /*
             * CONFIRM / COMPLETE
             *
             * Synchronize patient tracking.
             */
            if (
                newStatus ===
                    'confirmed' ||
                newStatus ===
                    'completed'
            ) {
                if (
                    trackingRef &&
                    trackingSnapshot?.exists()
                ) {
                    transaction.update(
                        trackingRef,
                        {
                            status:
                                newStatus,

                            updatedAt:
                                serverTimestamp(),
                        },
                    )
                }
            }

            /*
             * UPDATE APPOINTMENT STATUS
             */
            transaction.update(
                appointmentRef,
                {
                    status:
                        newStatus,
                    updatedAt:
                        serverTimestamp(),
                },
            )
        },
    )
}

/*
 * VALID STATUS TRANSITIONS
 */
function isValidTransition(
    currentStatus: AppointmentStatus,
    newStatus: AppointmentStatus,
) {
    if (
        currentStatus ===
        newStatus
    ) {
        return false
    }

    switch (currentStatus) {
        case 'pending':
            return (
                newStatus ===
                    'confirmed' ||
                newStatus ===
                    'cancelled'
            )

        case 'confirmed':
            return (
                newStatus ===
                    'completed' ||
                newStatus ===
                    'cancelled'
            )

        case 'cancelled':
            return (
                newStatus ===
                'pending'
            )

        case 'completed':
            return false

        default:
            return false
    }
}

/*
 * NORMALIZE OLD / UNKNOWN DATA
 */
function normalizeStatus(
    status: unknown,
): AppointmentStatus {
    switch (status) {
        case 'confirmed':
            return 'confirmed'

        case 'completed':
            return 'completed'

        case 'cancelled':
            return 'cancelled'

        case 'pending':
        default:
            return 'pending'
    }
}

/*
 * DISPLAY STATUS
 */
function formatStatus(
    status: AppointmentStatus,
) {
    switch (status) {
        case 'pending':
            return 'Pending'

        case 'confirmed':
            return 'Confirmed'

        case 'completed':
            return 'Completed'

        case 'cancelled':
            return 'Cancelled'
    }
}
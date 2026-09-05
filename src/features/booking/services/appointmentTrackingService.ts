import {
    doc,
    onSnapshot,
} from 'firebase/firestore'

import { db } from '../../../lib/firebase'

export type AppointmentTrackingStatus =
    | 'pending'
    | 'confirmed'
    | 'completed'
    | 'cancelled'

export type AppointmentTracking = {
    appointmentNumber: string
    serviceName: string
    duration: number
    price: number
    priceLabel: string | null
    date: string
    time: string
    status: AppointmentTrackingStatus
    cancellationReason: string | null
}

export function subscribeToAppointmentTracking(
    trackingToken: string,
    onUpdate: (
        appointment: AppointmentTracking | null,
    ) => void,
    onError: (
        error: Error,
    ) => void,
) {
    if (!trackingToken) {
        onUpdate(null)

        return () => {}
    }

    const trackingRef =
        doc(
            db,
            'appointment_tracking',
            trackingToken,
        )

    return onSnapshot(
        trackingRef,
        (snapshot) => {
            if (!snapshot.exists()) {
                onUpdate(null)

                return
            }

            const data =
                snapshot.data()

            onUpdate({
                appointmentNumber:
                    String(
                        data.appointmentNumber ??
                            '',
                    ),

                serviceName:
                    String(
                        data.serviceName ??
                            '',
                    ),

                duration:
                    Number(
                        data.duration ??
                            0,
                    ),

                price:
                    Number(
                        data.price ??
                            0,
                    ),

                priceLabel:
                    typeof data.priceLabel === 'string'
                        ? data.priceLabel
                        : null,

                date:
                    String(
                        data.date ??
                            '',
                    ),

                time:
                    String(
                        data.time ??
                            '',
                    ),

                status:
                    normalizeStatus(
                        data.status,
                    ),

                cancellationReason:
                    typeof data.cancellationReason ===
                    'string'
                        ? data.cancellationReason
                        : null,
            })
        },
        (error) => {
            console.error(
                'Appointment tracking listener failed:',
                error,
            )

            onError(error)
        },
    )
}

function normalizeStatus(
    value: unknown,
): AppointmentTrackingStatus {
    if (
        value === 'confirmed' ||
        value === 'completed' ||
        value === 'cancelled'
    ) {
        return value
    }

    return 'pending'
}
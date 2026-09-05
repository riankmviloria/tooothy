import {
    useEffect,
    useState,
} from 'react'

import type {
    Booking,
} from '../types/booking.types'
import type { Service } from '../../services/types/service.types'


import {
    createAppointment,
} from '../services/appointmentService'

import {
    getBookedTimes,
} from '../services/appointmentSlotService'

function useBooking() {
    // =========================================================
    // BOOKING STATE
    // =========================================================

    const [
        step,
        setStep,
    ] = useState(1)

    const [
        confirmed,
        setConfirmed,
    ] = useState(false)

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false)

    const [
        error,
        setError,
    ] = useState<string | null>(
        null,
    )

    // =========================================================
    // BOOKED TIMES
    // =========================================================

    const [
        bookedTimes,
        setBookedTimes,
    ] = useState<string[]>([])

    const [
        isLoadingBookedTimes,
        setIsLoadingBookedTimes,
    ] = useState(false)

    // =========================================================
    // PATIENT TRACKING
    // =========================================================

    const [
        trackingToken,
        setTrackingToken,
    ] = useState<string | null>(
        null,
    )

    const [
        appointmentNumber,
        setAppointmentNumber,
    ] = useState<string | null>(
        null,
    )

    // =========================================================
    // BOOKING DATA
    // =========================================================

    const [
        booking,
        setBooking,
    ] = useState<Booking>({
        service: null,

        date: null,

        time: null,

        patient: {
            fullName: '',

            phone: '',

            email: '',

            notes: '',
        },
    })

    // =========================================================
    // SELECT SERVICE
    // =========================================================

    const selectService = (
        service: Service,
    ) => {
        setBooking(
            (current) => ({
                ...current,

                service,
            }),
        )
    }

    // =========================================================
    // SELECT DATE
    // =========================================================

    const selectDate = (
        date: string | null,
    ) => {
        setBooking(
            (current) => ({
                ...current,

                date,

                time: null,
            }),
        )

        setBookedTimes([])

        setError(null)
    }

    // =========================================================
    // SELECT TIME
    // =========================================================

    const selectTime = (
        time: string | null,
    ) => {
        setBooking(
            (current) => ({
                ...current,

                time,
            }),
        )

        setError(null)
    }

    // =========================================================
    // UPDATE PATIENT
    // =========================================================

    const updatePatient = (
        field:
            keyof Booking['patient'],
        value: string,
    ) => {
        setBooking(
            (current) => ({
                ...current,

                patient: {
                    ...current.patient,

                    [field]:
                        value,
                },
            }),
        )
    }

    // =========================================================
    // NEXT STEP
    // =========================================================

    const goNext = () => {
        setError(null)

        setStep(
            (current) =>
                current + 1,
        )
    }

    // =========================================================
    // PREVIOUS STEP
    // =========================================================

    const goBack = () => {
        setError(null)

        setStep(
            (current) =>
                Math.max(
                    1,
                    current - 1,
                ),
        )
    }

    // =========================================================
    // CONFIRMATION VALIDATION
    // =========================================================

    const canConfirm =
        booking.patient.fullName.trim() !==
            '' &&
        booking.patient.phone.trim() !==
            '' &&
        booking.patient.email.trim() !==
            '' &&
        booking.service !== null &&
        booking.date !== null &&
        booking.time !== null

    // =========================================================
    // LOAD BOOKED TIMES
    // =========================================================

    useEffect(() => {
        if (!booking.date) {
            return
        }

        let cancelled = false

        const loadBookedTimes =
            async () => {
                setIsLoadingBookedTimes(
                    true,
                )

                setError(null)

                try {
                    const times =
                        await getBookedTimes(
                            booking.date!,
                        )

                    if (
                        !cancelled
                    ) {
                        setBookedTimes(
                            times,
                        )
                    }
                } catch (
                    error
                ) {
                    console.error(
                        'Failed to load booked times:',
                        error,
                    )

                    if (
                        !cancelled
                    ) {
                        setError(
                            error instanceof
                                Error
                                ? error.message
                                : 'We could not load the available appointment times.',
                        )
                    }
                } finally {
                    if (
                        !cancelled
                    ) {
                        setIsLoadingBookedTimes(
                            false,
                        )
                    }
                }
            }

        loadBookedTimes()

        return () => {
            cancelled = true
        }
    }, [booking.date])

    // =========================================================
    // CONFIRM BOOKING
    // =========================================================

    const confirmBooking =
        async () => {
            if (
                !canConfirm ||
                isSubmitting
            ) {
                return
            }

            setIsSubmitting(
                true,
            )

            setError(null)

            try {
                const result =
                    await createAppointment(
                        booking,
                    )

                setTrackingToken(
                    result.trackingToken,
                )

                setAppointmentNumber(
                    result.appointmentNumber,
                )

                setConfirmed(
                    true,
                )
            } catch (
                error
            ) {
                console.error(
                    'Failed to create appointment:',
                    error,
                )

                setError(
                    error instanceof
                        Error
                        ? error.message
                        : 'We could not confirm your appointment. Please try again.',
                )
            } finally {
                setIsSubmitting(
                    false,
                )
            }
        }

    // =========================================================
    // RETURN
    // =========================================================

    return {
        step,

        booking,

        confirmed,

        canConfirm,

        isSubmitting,

        error,

        bookedTimes,

        isLoadingBookedTimes,

        trackingToken,

        appointmentNumber,

        selectService,

        selectDate,

        selectTime,

        updatePatient,

        goNext,

        goBack,

        confirmBooking,
    }
}

export default useBooking
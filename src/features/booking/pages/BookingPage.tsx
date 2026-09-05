import {
    Badge,
    Button,
    Container,
    Group,
    Stack,
    Text,
    Title,
} from '@mantine/core'
import {
    useEffect,
    useState,
} from 'react'

import ServiceSelection from '../components/ServiceSelection'
import DateSelection from '../components/DateSelection'
import TimeSelection from '../components/TimeSelection'
import AppointmentSummary from '../components/AppointmentSummary'
import PatientDetails from '../components/PatientDetails'
import BookingConfirmation from '../components/BookingConfirmation'

import {
    subscribeToServices,
} from '../../services/data/serviceRepository'

import type {
    Service,
} from '../../services/types/service.types'

import {
    subscribeToBlockedDates,
    type BlockedDate,
} from '../services/blockedDateService'

import {
    subscribeToSchedule,
    type WeeklySchedule,
} from '../services/scheduleService'

import {
    generateTimeSlots,
} from '../utils/generateTimeSlots'

import useBooking from '../hooks/useBooking'

function BookingPage() {
    const {
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
    } = useBooking()

    /*
     * SERVICES
     */
    const [
        services,
        setServices,
    ] = useState<Service[]>([])

    const [
        isLoadingServices,
        setIsLoadingServices,
    ] = useState(true)

    /*
     * BLOCKED DATES
     */
    const [
        blockedDates,
        setBlockedDates,
    ] = useState<BlockedDate[]>([])

    /*
     * CLINIC SCHEDULE
     */
    const [
        schedule,
        setSchedule,
    ] = useState<WeeklySchedule | null>(
        null,
    )

    const [
        isLoadingSchedule,
        setIsLoadingSchedule,
    ] = useState(true)

    /*
     * REALTIME SERVICES
     */
    useEffect(() => {
        const unsubscribe =
            subscribeToServices(
                (data) => {
                    setServices(
                        data.filter(
                            (service) =>
                                service.isActive,
                        ),
                    )

                    setIsLoadingServices(
                        false,
                    )
                },
                (error) => {
                    console.error(
                        'Failed to load services:',
                        error,
                    )

                    setIsLoadingServices(
                        false,
                    )
                },
            )

        return () => {
            unsubscribe()
        }
    }, [])

    /*
     * REALTIME BLOCKED DATES
     */
    useEffect(() => {
        const unsubscribe =
            subscribeToBlockedDates(
                (data) => {
                    setBlockedDates(data)
                },
                (error) => {
                    console.error(
                        'Failed to load blocked dates:',
                        error,
                    )
                },
            )

        return () => {
            unsubscribe()
        }
    }, [])

    /*
     * REALTIME CLINIC SCHEDULE
     */
    useEffect(() => {
        const unsubscribe =
            subscribeToSchedule(
                (data) => {
                    setSchedule(data)

                    setIsLoadingSchedule(
                        false,
                    )
                },
                (error) => {
                    console.error(
                        'Failed to load clinic schedule:',
                        error,
                    )

                    setIsLoadingSchedule(
                        false,
                    )
                },
            )

        return () => {
            unsubscribe()
        }
    }, [])

    /*
     * GET DAY KEY
     */
    const getDayKey = (
        date: string,
    ): keyof WeeklySchedule => {
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

    /*
     * CHECK IF DATE IS CLOSED
     */
    const isDateClosed = (
        date: string,
    ) => {
        if (!schedule) {
            return false
        }

        const isBlocked =
            blockedDates.some(
                (blockedDate) =>
                    blockedDate.date ===
                    date,
            )

        if (isBlocked) {
            return true
        }

        const dayKey =
            getDayKey(date)

        const daySchedule =
            schedule[dayKey]

        if (
            !daySchedule ||
            !daySchedule.enabled
        ) {
            return true
        }

        if (
            daySchedule.periods.length ===
            0
        ) {
            return true
        }

        return false
    }

    /*
     * GET SELECTED DAY'S SCHEDULE
     */
    const selectedDaySchedule =
        booking.date &&
        schedule
            ? schedule[
                  getDayKey(
                      booking.date,
                  )
              ]
            : null

    /*
     * GENERATE TIME SLOTS
     */
    const generatedTimeSlots =
        generateTimeSlots(
            selectedDaySchedule,
        )

    /*
     * REMOVE ALREADY BOOKED TIMES
     */
    const availableTimeSlots =
        generatedTimeSlots.map(
            (slot) => ({
                ...slot,

                available:
                    !bookedTimes.includes(
                        slot.time,
                    ),
            }),
        )

    /*
     * LOADING SERVICES
     */
    if (
        isLoadingServices
    ) {
        return (
            <main>
                <Container
                    size="sm"
                    py="xl"
                >
                    <Stack
                        align="center"
                        gap="md"
                    >
                        <Text
                            size="lg"
                            fw={600}
                        >
                            Loading services...
                        </Text>

                        <Text
                            size="sm"
                            c="dimmed"
                            ta="center"
                        >
                            Please wait a moment.
                        </Text>
                    </Stack>
                </Container>
            </main>
        )
    }

    /*
     * CONFIRMATION
     */
    if (confirmed) {
        return (
            <BookingConfirmation
                selectedService={
                    booking.service
                }
                selectedDate={
                    booking.date
                }
                selectedTime={
                    booking.time
                }
                fullName={
                    booking.patient.fullName
                }
                appointmentNumber={
                    appointmentNumber
                }
                trackingToken={
                    trackingToken
                }
                onBackHome={() => {
                    window.location.href =
                        '/'
                }}
            />
        )
    }

    /*
     * STEP 4
     */
    if (step === 4) {
        return (
            <main>
                <Container
                    size="sm"
                    py="xl"
                >
                    <Stack gap="xl">

                        {/* Heading */}

                        <Stack gap="xs">
                            <Badge
                                color="smilehaos"
                                variant="light"
                                w="fit-content"
                            >
                                Step 4
                            </Badge>

                            <Title
                                order={1}
                                size="clamp(2.2rem, 6vw, 3.5rem)"
                                style={{
                                    letterSpacing:
                                        '-0.04em',
                                }}
                            >
                                Almost there!
                            </Title>

                            <Text
                                size="lg"
                                c="dimmed"
                            >
                                We just need a few
                                details to confirm your
                                appointment.
                            </Text>
                        </Stack>

                        {/* Appointment Summary */}

                        <AppointmentSummary
                            selectedService={
                                booking.service
                            }
                            selectedDate={
                                booking.date
                            }
                            selectedTime={
                                booking.time
                            }
                        />

                        {/* Patient Details */}

                        <PatientDetails
                            fullName={
                                booking.patient
                                    .fullName
                            }
                            phone={
                                booking.patient
                                    .phone
                            }
                            email={
                                booking.patient
                                    .email
                            }
                            notes={
                                booking.patient
                                    .notes
                            }
                            onFullNameChange={(
                                value,
                            ) =>
                                updatePatient(
                                    'fullName',
                                    value,
                                )
                            }
                            onPhoneChange={(
                                value,
                            ) =>
                                updatePatient(
                                    'phone',
                                    value,
                                )
                            }
                            onEmailChange={(
                                value,
                            ) =>
                                updatePatient(
                                    'email',
                                    value,
                                )
                            }
                            onNotesChange={(
                                value,
                            ) =>
                                updatePatient(
                                    'notes',
                                    value,
                                )
                            }
                        />

                        {/* Error */}

                        {error && (
                            <Text
                                c="red"
                                size="sm"
                                ta="center"
                            >
                                {error}
                            </Text>
                        )}

                        {/* Navigation */}

                        <Group
                            justify="space-between"
                        >
                            <Button
                                variant="subtle"
                                size="lg"
                                onClick={
                                    goBack
                                }
                                disabled={
                                    isSubmitting
                                }
                            >
                                Back
                            </Button>

                            <Button
                                size="lg"
                                loading={
                                    isSubmitting
                                }
                                disabled={
                                    !canConfirm ||
                                    isSubmitting
                                }
                                onClick={
                                    confirmBooking
                                }
                            >
                                Confirm appointment
                            </Button>
                        </Group>

                    </Stack>
                </Container>
            </main>
        )
    }

    /*
     * STEP 3
     */
    if (step === 3) {
        if (
            isLoadingSchedule
        ) {
            return (
                <main>
                    <Container
                        size="sm"
                        py="xl"
                    >
                        <Stack
                            align="center"
                            gap="md"
                        >
                            <Text
                                size="lg"
                                fw={600}
                            >
                                Loading available times...
                            </Text>

                            <Text
                                size="sm"
                                c="dimmed"
                                ta="center"
                            >
                                Checking the clinic schedule.
                            </Text>
                        </Stack>
                    </Container>
                </main>
            )
        }

        return (
            <TimeSelection
                selectedService={
                    booking.service
                }
                selectedDate={
                    booking.date
                }
                selectedTime={
                    booking.time
                }
                timeSlots={
                    availableTimeSlots
                }
                bookedTimes={
                    bookedTimes
                }
                isLoadingBookedTimes={
                    isLoadingBookedTimes
                }
                onTimeChange={
                    selectTime
                }
                onBack={
                    goBack
                }
                onContinue={
                    goNext
                }
            />
        )
    }

    /*
     * STEP 2
     */
    if (step === 2) {
        return (
            <DateSelection
                selectedService={
                    booking.service
                }
                selectedDate={
                    booking.date
                }
                onDateChange={
                    selectDate
                }
                onBack={
                    goBack
                }
                onContinue={
                    goNext
                }
                isDateClosed={
                    isDateClosed
                }
            />
        )
    }

    /*
     * STEP 1
     */
    return (
        <ServiceSelection
            services={
                services
            }
            selectedService={
                booking.service
            }
            onSelect={
                selectService
            }
            onContinue={
                goNext
            }
        />
    )
}

export default BookingPage
import {
    Badge,
    Button,
    Container,
    Group,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core'

import {
    AnimatePresence,
    motion,
} from 'motion/react'

import {
    useEffect,
    useRef,
    useState,
} from 'react'

import ServiceSelection from '../components/ServiceSelection'
import DateSelection from '../components/DateSelection'
import TimeSelection from '../components/TimeSelection'
import AppointmentSummary from '../components/AppointmentSummary'
import PatientDetails from '../components/PatientDetails'
import BookingConfirmation from '../components/BookingConfirmation'
import BookingHeader from '../components/BookingHeader'

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

import {
    IconSparkles,
} from '@tabler/icons-react'

/* =========================================================
   MOTION
========================================================= */

const pageVariants = {
    initial: {
        opacity: 0,
        y: 18,
    },

    animate: {
        opacity: 1,
        y: 0,
    },

    exit: {
        opacity: 0,
        y: -18,
    },
}

const pageTransition = {
    duration: 0.35,
    ease: 'easeOut' as const,
}

const fadeUpVariants = {
    hidden: {
        opacity: 0,
        y: 20,
    },

    visible: {
        opacity: 1,
        y: 0,
    },
}

const staggerVariants = {
    hidden: {},

    visible: {
        transition: {
            staggerChildren: 0.08,
        },
    },
}

/* =========================================================
   BOOKING PAGE
========================================================= */

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
     * =======================================================
     * BOOKING TOP ANCHOR
     * =======================================================
     *
     * This gives us a reliable element to scroll to whenever
     * the booking step changes.
     */

    const bookingTopRef =
        useRef<HTMLDivElement>(null)

    /*
     * =======================================================
     * SCROLL TO TOP WHEN BOOKING STEP CHANGES
     * =======================================================
     *
     * Handles both:
     *
     * Next:
     * Step 1 → 2 → 3 → 4
     *
     * Back:
     * Step 4 → 3 → 2 → 1
     *
     * The timeout allows the new step content to render
     * before attempting to scroll.
     */

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            if (confirmed) {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'auto',
                })

                document.documentElement.scrollTop = 0
                document.body.scrollTop = 0

                return
            }

            bookingTopRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })

            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
            })

            document.documentElement.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
            })

            document.body.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
            })
        }, confirmed ? 0 : 50)

        return () => {
            window.clearTimeout(timeout)
        }
    }, [step, confirmed])

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
     * =======================================================
     * REALTIME SERVICES
     * =======================================================
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
     * =======================================================
     * REALTIME BLOCKED DATES
     * =======================================================
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
     * =======================================================
     * REALTIME CLINIC SCHEDULE
     * =======================================================
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
     * =======================================================
     * GET DAY KEY
     * =======================================================
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
     * =======================================================
     * CHECK IF DATE IS CLOSED
     * =======================================================
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
     * =======================================================
     * GET SELECTED DAY'S SCHEDULE
     * =======================================================
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
     * =======================================================
     * GENERATE TIME SLOTS
     * =======================================================
     */

    const generatedTimeSlots =
        generateTimeSlots(
            selectedDaySchedule,
        )

    /*
     * =======================================================
     * REMOVE ALREADY BOOKED TIMES
     * =======================================================
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

    /* =====================================================
       LOADING SERVICES
    ===================================================== */

    if (isLoadingServices) {
        return (
            <main
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    background:
                        'linear-gradient(180deg, var(--mantine-color-gray-0) 0%, #ffffff 55%, var(--mantine-color-smilehaos-0) 100%)',
                    overflow: 'hidden',
                }}
            >
                <Container
                    size="sm"
                    py="xl"
                >
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 25,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.6,
                            ease: 'easeOut',
                        }}
                    >
                        <Paper
                            radius={32}
                            p="xl"
                            withBorder
                            style={{
                                position:
                                    'relative',
                                overflow:
                                    'hidden',
                                background:
                                    '#ffffff',
                                borderColor:
                                    'var(--mantine-color-gray-2)',
                                boxShadow:
                                    '0 35px 100px rgba(0, 0, 0, 0.09)',
                            }}
                        >
                            {/* =================================================
                                DECORATIVE GLOW
                            ================================================= */}

                            <motion.div
                                animate={{
                                    scale: [
                                        1,
                                        1.08,
                                        1,
                                    ],
                                    rotate: [
                                        0,
                                        8,
                                        0,
                                    ],
                                }}
                                transition={{
                                    duration: 7,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                style={{
                                    position:
                                        'absolute',
                                    width: 280,
                                    height: 280,
                                    borderRadius:
                                        '50%',
                                    background:
                                        'var(--mantine-color-smilehaos-0)',
                                    right: -150,
                                    top: -150,
                                    pointerEvents:
                                        'none',
                                }}
                            />

                            <motion.div
                                animate={{
                                    y: [
                                        0,
                                        -10,
                                        0,
                                    ],
                                    rotate: [
                                        0,
                                        -6,
                                        0,
                                    ],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                style={{
                                    position:
                                        'absolute',
                                    width: 180,
                                    height: 180,
                                    borderRadius:
                                        '50%',
                                    background:
                                        'var(--mantine-color-smilehaos-1)',
                                    left: -100,
                                    bottom: -100,
                                    pointerEvents:
                                        'none',
                                }}
                            />

                            <Stack
                                align="center"
                                gap="xl"
                                py="xl"
                                style={{
                                    position:
                                        'relative',
                                    zIndex: 1,
                                }}
                            >
                                {/* =================================================
                                    ANIMATED ICON
                                ================================================= */}

                                <motion.div
                                    animate={{
                                        rotate: [
                                            0,
                                            8,
                                            -8,
                                            0,
                                        ],
                                        scale: [
                                            1,
                                            1.06,
                                            1,
                                        ],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                >
                                    <ThemeIcon
                                        size={96}
                                        radius="50%"
                                        color="smilehaos"
                                        variant="light"
                                        style={{
                                            boxShadow:
                                                '0 20px 50px rgba(0, 0, 0, 0.10)',
                                        }}
                                    >
                                        <IconSparkles
                                            size={44}
                                            stroke={1.8}
                                        />
                                    </ThemeIcon>
                                </motion.div>

                                {/* =================================================
                                    STATUS BADGE
                                ================================================= */}

                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        scale: 0.9,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                    }}
                                    transition={{
                                        delay: 0.15,
                                        duration: 0.4,
                                    }}
                                >
                                    <Badge
                                        color="smilehaos"
                                        variant="light"
                                        size="lg"
                                        radius="xl"
                                        leftSection={
                                            <IconSparkles
                                                size={14}
                                            />
                                        }
                                    >
                                        SmileHaos Dental Clinic
                                    </Badge>
                                </motion.div>

                                {/* =================================================
                                    MESSAGE
                                ================================================= */}

                                <Stack
                                    align="center"
                                    gap="sm"
                                >
                                    <Title
                                        order={2}
                                        ta="center"
                                        size="clamp(1.8rem, 5vw, 2.6rem)"
                                        style={{
                                            letterSpacing:
                                                '-0.04em',
                                        }}
                                    >
                                        Getting your
                                        <br />

                                        <Text
                                            component="span"
                                            inherit
                                            c="smilehaos.6"
                                        >
                                            smile-ready options...
                                        </Text>
                                    </Title>

                                    <Text
                                        size="lg"
                                        c="dimmed"
                                        ta="center"
                                        maw={480}
                                        lh={1.6}
                                    >
                                        We're loading the
                                        latest dental
                                        services available
                                        at SmileHaos.
                                    </Text>
                                </Stack>

                                {/* =================================================
                                    LOADER
                                ================================================= */}

                                <Stack
                                    align="center"
                                    gap="sm"
                                >
                                    <motion.div
                                        animate={{
                                            opacity: [
                                                0.35,
                                                1,
                                                0.35,
                                            ],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }}
                                    >
                                        <Text
                                            size="sm"
                                            fw={700}
                                            c="smilehaos.7"
                                        >
                                            Preparing your
                                            options
                                        </Text>
                                    </motion.div>

                                    <Group
                                        gap={6}
                                    >
                                        {[0, 1, 2].map(
                                            (
                                                index,
                                            ) => (
                                                <motion.div
                                                    key={
                                                        index
                                                    }
                                                    animate={{
                                                        y: [
                                                            0,
                                                            -6,
                                                            0,
                                                        ],
                                                        opacity:
                                                            [
                                                                0.35,
                                                                1,
                                                                0.35,
                                                            ],
                                                    }}
                                                    transition={{
                                                        duration:
                                                            0.9,
                                                        repeat:
                                                            Infinity,
                                                        delay:
                                                            index *
                                                            0.15,
                                                        ease: 'easeInOut',
                                                    }}
                                                    style={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius:
                                                            '50%',
                                                        background:
                                                            'var(--mantine-color-smilehaos-5)',
                                                    }}
                                                />
                                            ),
                                        )}
                                    </Group>
                                </Stack>
                            </Stack>
                        </Paper>
                    </motion.div>
                </Container>
            </main>
        )
    }

    /* =====================================================
       CONFIRMATION
    ===================================================== */

    if (confirmed) {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key="confirmation"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={
                        pageTransition
                    }
                >
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
                            booking.patient
                                .fullName
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
                </motion.div>
            </AnimatePresence>
        )
    }

    /* =====================================================
       STEP 4
    ===================================================== */

    if (step === 4) {
        return (
            <AnimatePresence mode="wait">
                <motion.main
                    key="step-4"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={
                        pageTransition
                    }
                >
                    <BookingHeader
                        step={4}
                        totalSteps={4}
                    />

                    <div
                        ref={bookingTopRef}
                        style={{
                            scrollMarginTop: 100,
                        }}
                    />

                    <Container
                        size="sm"
                        py="xl"
                    >
                        <motion.div
                            variants={
                                staggerVariants
                            }
                            initial="hidden"
                            animate="visible"
                        >
                            <Stack gap="xl">

                                {/* =================================================
                                    HEADING
                                ================================================= */}

                                <motion.div
                                    variants={
                                        fadeUpVariants
                                    }
                                >
                                    <Stack gap="xs">

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
                                            lh={1.7}
                                        >
                                            We just need a few
                                            details to confirm
                                            your appointment.
                                        </Text>
                                    </Stack>
                                </motion.div>

                                {/* =================================================
                                    APPOINTMENT SUMMARY
                                ================================================= */}

                                <motion.div
                                    variants={
                                        fadeUpVariants
                                    }
                                >
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
                                </motion.div>

                                {/* =================================================
                                    PATIENT DETAILS
                                ================================================= */}

                                <motion.div
                                    variants={
                                        fadeUpVariants
                                    }
                                >
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
                                </motion.div>

                                {/* =================================================
                                    ERROR
                                ================================================= */}

                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                height: 0,
                                                y: -10,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                height: 'auto',
                                                y: 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                height: 0,
                                                y: -10,
                                            }}
                                        >
                                            <Text
                                                c="red"
                                                size="sm"
                                                ta="center"
                                            >
                                                {error}
                                            </Text>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* =================================================
                                    NAVIGATION
                                ================================================= */}

                                <motion.div
                                    variants={
                                        fadeUpVariants
                                    }
                                >
                                    <Group
                                        justify="space-between"
                                        wrap="nowrap"
                                    >
                                        <motion.div
                                            whileHover={{
                                                x: -3,
                                            }}
                                            whileTap={{
                                                scale: 0.97,
                                            }}
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
                                        </motion.div>

                                        <motion.div
                                            whileHover={
                                                canConfirm &&
                                                    !isSubmitting
                                                    ? {
                                                        y: -3,
                                                    }
                                                    : {}
                                            }
                                            whileTap={
                                                canConfirm &&
                                                    !isSubmitting
                                                    ? {
                                                        scale: 0.97,
                                                    }
                                                    : {}
                                            }
                                        >
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
                                        </motion.div>
                                    </Group>
                                </motion.div>

                            </Stack>
                        </motion.div>
                    </Container>
                </motion.main>
            </AnimatePresence>
        )
    }

    /* =====================================================
       STEP 3
    ===================================================== */

    if (step === 3) {
        if (isLoadingSchedule) {
            return (
                <main>
                    <div
                        ref={bookingTopRef}
                        style={{
                            scrollMarginTop: 100,
                        }}
                    />

                    <Container
                        size="sm"
                        py="xl"
                    >
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={
                                pageTransition
                            }
                        >
                            <Stack
                                align="center"
                                gap="md"
                            >
                                <motion.div
                                    animate={{
                                        rotate: [
                                            0,
                                            8,
                                            -8,
                                            0,
                                        ],
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                >
                                    <Text
                                        size="2rem"
                                    >
                                        📅
                                    </Text>
                                </motion.div>

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
                        </motion.div>
                    </Container>
                </main>
            )
        }

        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key="step-3"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={
                        pageTransition
                    }
                >
                    <div
                        ref={bookingTopRef}
                        style={{
                            scrollMarginTop: 100,
                        }}
                    />

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
                </motion.div>
            </AnimatePresence>
        )
    }

    /* =====================================================
       STEP 2
    ===================================================== */

    if (step === 2) {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key="step-2"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={
                        pageTransition
                    }
                >
                    <div
                        ref={bookingTopRef}
                        style={{
                            scrollMarginTop: 100,
                        }}
                    />

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
                </motion.div>
            </AnimatePresence>
        )
    }

    /* =====================================================
       STEP 1
    ===================================================== */

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="step-1"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={
                    pageTransition
                }
            >
                <div
                    ref={bookingTopRef}
                    style={{
                        scrollMarginTop: 100,
                    }}
                />

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
            </motion.div>
        </AnimatePresence>
    )
}

export default BookingPage

import {
    Badge,
    Card,
    Container,
    Group,
    Select,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core'

import {
    IconCalendar,
    IconSearch,
    IconX,
} from '@tabler/icons-react'

import { motion } from 'motion/react'

import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import AppointmentDetailsModal from '../components/AppointmentDetailsModal'

import AppointmentCalendar, {
    type CalendarView,
} from '../components/AppointmentCalendar'

import CalendarDayAppointmentsModal from '../components/CalendarDayAppointmentsModal'

import {
    subscribeToAppointments,
    updateAppointmentStatus,
} from '../services/appointmentAdminService'

import type {
    AdminAppointment,
    AppointmentStatus,
} from '../services/appointmentAdminService'


// =============================================================
// STATUS OPTIONS
// =============================================================

const statusOptions = [
    {
        value: 'all',
        label: 'All statuses',
    },
    {
        value: 'pending',
        label: 'Pending',
    },
    {
        value: 'confirmed',
        label: 'Confirmed',
    },
    {
        value: 'completed',
        label: 'Completed',
    },
    {
        value: 'cancelled',
        label: 'Cancelled',
    },
]


// =============================================================
// DATE HELPERS
// =============================================================

function isValidDate(
    value: Date,
): boolean {
    return (
        value instanceof Date &&
        !Number.isNaN(value.getTime())
    )
}


/**
 * Safely creates a local Date from YYYY-MM-DD.
 *
 * IMPORTANT:
 * Do NOT use:
 *
 * new Date('2026-09-05')
 *
 * because JavaScript treats date-only strings as UTC.
 */


/**
 * Converts a Date to the application's
 * local YYYY-MM-DD date key.
 */

/**
 * Safely formats the month/year displayed
 * above the calendar.
 */
function formatDate(
    date: Date,
): string {
    if (!isValidDate(date)) {
        return 'Calendar'
    }

    return date.toLocaleDateString(
        'en-US',
        {
            month: 'long',
            year: 'numeric',
        },
    )
}


// =============================================================
// COMPONENT
// =============================================================

function AdminAppointmentsPage() {
    const [
        appointments,
        setAppointments,
    ] = useState<
        AdminAppointment[]
    >([])

    const [
        loading,
        setLoading,
    ] = useState(true)

    const [
        search,
        setSearch,
    ] = useState('')

    const [
        statusFilter,
        setStatusFilter,
    ] = useState<string>('all')

    const [
        calendarView,
        setCalendarView,
    ] = useState<CalendarView>('month')

    const [
        currentDate,
        setCurrentDate,
    ] = useState<Date>(() =>
        new Date(),
    )

    const [
        selectedAppointment,
        setSelectedAppointment,
    ] =
        useState<AdminAppointment | null>(
            null,
        )

    const [
        updatingId,
        setUpdatingId,
    ] =
        useState<string | null>(null)

    const [
        overflowDate,
        setOverflowDate,
    ] =
        useState<Date | null>(null)

    const [
        overflowAppointments,
        setOverflowAppointments,
    ] =
        useState<AdminAppointment[]>([])


    // =========================================================
    // SAFE CURRENT DATE
    // =========================================================

    const safeCurrentDate =
        useMemo(() => {
            if (
                isValidDate(
                    currentDate,
                )
            ) {
                return currentDate
            }

            return new Date()
        }, [currentDate])


    // =========================================================
    // REALTIME APPOINTMENTS
    // =========================================================

    useEffect(() => {
        setLoading(true)

        const unsubscribe =
            subscribeToAppointments(
                (data) => {
                    setAppointments(
                        Array.isArray(data)
                            ? data
                            : [],
                    )

                    setLoading(false)
                },
                (error) => {
                    console.error(
                        'Failed to subscribe to appointments:',
                        error,
                    )

                    setAppointments([])

                    setLoading(false)
                },
            )

        return () => {
            unsubscribe()
        }
    }, [])


    // =========================================================
    // FILTERING
    // =========================================================

    const filteredAppointments =
        useMemo(() => {
            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase()

            return appointments.filter(
                (
                    appointment,
                ) => {
                    const patient =
                        appointment.patient

                    const fullName =
                        patient?.fullName
                            ?.toLowerCase() ??
                        ''

                    const phone =
                        patient?.phone
                            ?.toLowerCase() ??
                        ''

                    const email =
                        patient?.email
                            ?.toLowerCase() ??
                        ''

                    const serviceName =
                        appointment.serviceName
                            ?.toLowerCase() ??
                        ''

                    const appointmentDate =
                        appointment.date
                            ?.toString()
                            .trim()
                            .toLowerCase() ??
                        ''

                    const matchesSearch =
                        normalizedSearch ===
                            '' ||
                        fullName.includes(
                            normalizedSearch,
                        ) ||
                        phone.includes(
                            normalizedSearch,
                        ) ||
                        email.includes(
                            normalizedSearch,
                        ) ||
                        serviceName.includes(
                            normalizedSearch,
                        ) ||
                        appointmentDate.includes(
                            normalizedSearch,
                        )

                    const matchesStatus =
                        statusFilter ===
                            'all' ||
                        appointment.status ===
                            statusFilter

                    return (
                        matchesSearch &&
                        matchesStatus
                    )
                },
            )
        }, [
            appointments,
            search,
            statusFilter,
        ])


    // =========================================================
    // STATISTICS
    // =========================================================

    const totalCount =
        appointments.length

    const pendingCount =
        appointments.filter(
            (
                appointment,
            ) =>
                appointment.status ===
                'pending',
        ).length

    const confirmedCount =
        appointments.filter(
            (
                appointment,
            ) =>
                appointment.status ===
                'confirmed',
        ).length

    const completedCount =
        appointments.filter(
            (
                appointment,
            ) =>
                appointment.status ===
                'completed',
        ).length


    // =========================================================
    // STATUS UPDATE
    // =========================================================

    const handleStatusChange =
        async (
            appointmentId: string,
            status: AppointmentStatus,
        ) => {
            try {
                setUpdatingId(
                    appointmentId,
                )

                await updateAppointmentStatus(
                    appointmentId,
                    status,
                )

                setSelectedAppointment(
                    (current) => {
                        if (
                            !current ||
                            current.id !==
                                appointmentId
                        ) {
                            return current
                        }

                        return {
                            ...current,
                            status,
                        }
                    },
                )
            } catch (error) {
                console.error(
                    'Failed to update appointment status:',
                    error,
                )
            } finally {
                setUpdatingId(null)
            }
        }


    // =========================================================
    // CALENDAR DATE CHANGE
    // =========================================================

    const handleDateChange = (
        date: Date,
    ) => {
        if (!isValidDate(date)) {
            console.warn(
                'Ignored invalid calendar date:',
                date,
            )

            return
        }

        setCurrentDate(date)
    }


    // =========================================================
    // CALENDAR OVERFLOW
    // =========================================================

    const handleMoreClick = (
        date: Date,
        dayAppointments: AdminAppointment[],
    ) => {
        if (!isValidDate(date)) {
            console.warn(
                'Ignored invalid overflow date:',
                date,
            )

            return
        }

        setOverflowDate(date)

        setOverflowAppointments(
            Array.isArray(
                dayAppointments,
            )
                ? dayAppointments
                : [],
        )
    }


    const closeOverflowModal =
        () => {
            setOverflowDate(null)

            setOverflowAppointments(
                [],
            )
        }


    const handleOverflowAppointmentClick =
        (
            appointment: AdminAppointment,
        ) => {
            closeOverflowModal()

            setSelectedAppointment(
                appointment,
            )
        }


    // =========================================================
    // FILTER RESET
    // =========================================================

    const hasFilters =
        search.trim() !== '' ||
        statusFilter !== 'all'


    const clearFilters = () => {
        setSearch('')
        setStatusFilter('all')
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Container
            size="xl"
            py={32}
        >
            <Stack gap={28}>

                {/* ================================================= */}
                {/* PAGE HEADER */}
                {/* ================================================= */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 18,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.45,
                    }}
                >
                    <Stack gap={5}>

                        <Badge
                            variant="light"
                            color="blue"
                            radius="xl"
                            size="sm"
                            leftSection={
                                <IconCalendar
                                    size={14}
                                />
                            }
                        >
                            Appointment management
                        </Badge>

                        <Title
                            order={1}
                            fw={800}
                            style={{
                                letterSpacing:
                                    '-0.03em',
                            }}
                        >
                            Appointments
                        </Title>

                        <Text
                            c="dimmed"
                            size="sm"
                            maw={650}
                        >
                            Manage your clinic
                            schedule, review
                            appointments, and
                            keep track of
                            patient visits.
                        </Text>

                    </Stack>
                </motion.div>


                {/* ================================================= */}
                {/* STAT CARDS */}
                {/* ================================================= */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.45,
                        delay: 0.08,
                    }}
                >
                    <Group
                        align="stretch"
                        wrap="wrap"
                        gap="md"
                    >

                        {/* TOTAL */}

                        <motion.div
                            whileHover={{
                                y: -3,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                            style={{
                                flex:
                                    '1 1 220px',
                            }}
                        >
                            <Card
                                withBorder
                                radius="xl"
                                p="lg"
                                h="100%"
                            >
                                <Stack gap={4}>
                                    <Text
                                        size="xs"
                                        fw={700}
                                        tt="uppercase"
                                        c="dimmed"
                                    >
                                        Total
                                    </Text>

                                    <Text
                                        fw={800}
                                        size="xl"
                                    >
                                        {
                                            totalCount
                                        }
                                    </Text>

                                    <Text
                                        size="xs"
                                        c="dimmed"
                                    >
                                        All
                                        appointments
                                    </Text>
                                </Stack>
                            </Card>
                        </motion.div>


                        {/* PENDING */}

                        <motion.div
                            whileHover={{
                                y: -3,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                            style={{
                                flex:
                                    '1 1 220px',
                            }}
                        >
                            <Card
                                withBorder
                                radius="xl"
                                p="lg"
                                h="100%"
                            >
                                <Stack gap={4}>

                                    <Text
                                        size="xs"
                                        fw={700}
                                        tt="uppercase"
                                        c="dimmed"
                                    >
                                        Pending
                                    </Text>

                                    <Group gap={8}>
                                        <Text
                                            fw={800}
                                            size="xl"
                                        >
                                            {
                                                pendingCount
                                            }
                                        </Text>

                                        <Badge
                                            color="yellow"
                                            variant="light"
                                            size="sm"
                                        >
                                            Pending
                                        </Badge>
                                    </Group>

                                    <Text
                                        size="xs"
                                        c="dimmed"
                                    >
                                        Awaiting
                                        confirmation
                                    </Text>

                                </Stack>
                            </Card>
                        </motion.div>


                        {/* CONFIRMED */}

                        <motion.div
                            whileHover={{
                                y: -3,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                            style={{
                                flex:
                                    '1 1 220px',
                            }}
                        >
                            <Card
                                withBorder
                                radius="xl"
                                p="lg"
                                h="100%"
                            >
                                <Stack gap={4}>

                                    <Text
                                        size="xs"
                                        fw={700}
                                        tt="uppercase"
                                        c="dimmed"
                                    >
                                        Confirmed
                                    </Text>

                                    <Group gap={8}>
                                        <Text
                                            fw={800}
                                            size="xl"
                                        >
                                            {
                                                confirmedCount
                                            }
                                        </Text>

                                        <Badge
                                            color="blue"
                                            variant="light"
                                            size="sm"
                                        >
                                            Confirmed
                                        </Badge>
                                    </Group>

                                    <Text
                                        size="xs"
                                        c="dimmed"
                                    >
                                        Upcoming
                                        visits
                                    </Text>

                                </Stack>
                            </Card>
                        </motion.div>


                        {/* COMPLETED */}

                        <motion.div
                            whileHover={{
                                y: -3,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                            style={{
                                flex:
                                    '1 1 220px',
                            }}
                        >
                            <Card
                                withBorder
                                radius="xl"
                                p="lg"
                                h="100%"
                            >
                                <Stack gap={4}>

                                    <Text
                                        size="xs"
                                        fw={700}
                                        tt="uppercase"
                                        c="dimmed"
                                    >
                                        Completed
                                    </Text>

                                    <Text
                                        fw={800}
                                        size="xl"
                                    >
                                        {
                                            completedCount
                                        }
                                    </Text>

                                    <Text
                                        size="xs"
                                        c="dimmed"
                                    >
                                        Finished
                                        appointments
                                    </Text>

                                </Stack>
                            </Card>
                        </motion.div>

                    </Group>
                </motion.div>


                {/* ================================================= */}
                {/* FILTERS */}
                {/* ================================================= */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 16,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.4,
                        delay: 0.14,
                    }}
                >
                    <Card
                        withBorder
                        radius="xl"
                        p="md"
                    >
                        <Group
                            align="flex-end"
                            wrap="wrap"
                        >

                            <TextInput
                                label="Search"
                                placeholder="Patient, service, phone, email..."
                                leftSection={
                                    <IconSearch
                                        size={16}
                                    />
                                }
                                value={search}
                                onChange={(
                                    event,
                                ) =>
                                    setSearch(
                                        event
                                            .currentTarget
                                            .value,
                                    )
                                }
                                radius="md"
                                style={{
                                    flex: 1,
                                    minWidth: 260,
                                }}
                            />

                            <Select
                                label="Status"
                                data={
                                    statusOptions
                                }
                                value={
                                    statusFilter
                                }
                                onChange={(
                                    value,
                                ) =>
                                    setStatusFilter(
                                        value ??
                                            'all',
                                    )
                                }
                                radius="md"
                                w={190}
                            />

                            {hasFilters && (
                                <Badge
                                    component="button"
                                    type="button"
                                    variant="light"
                                    color="gray"
                                    size="lg"
                                    radius="md"
                                    leftSection={
                                        <IconX
                                            size={14}
                                        />
                                    }
                                    style={{
                                        cursor:
                                            'pointer',
                                        border: 0,
                                        height: 36,
                                    }}
                                    onClick={
                                        clearFilters
                                    }
                                >
                                    Clear filters
                                </Badge>
                            )}

                        </Group>
                    </Card>
                </motion.div>


                {/* ================================================= */}
                {/* CALENDAR */}
                {/* ================================================= */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.45,
                        delay: 0.2,
                    }}
                >
                    <Stack gap={8}>

                        <Group
                            justify="space-between"
                            align="center"
                        >
                            <Stack gap={2}>

                                <Title
                                    order={3}
                                    fw={750}
                                >
                                    Calendar
                                </Title>

                                <Text
                                    size="sm"
                                    c="dimmed"
                                >
                                    {formatDate(
                                        safeCurrentDate,
                                    )}
                                </Text>

                            </Stack>

                            <Badge
                                variant="light"
                                color="gray"
                                radius="xl"
                            >
                                {
                                    filteredAppointments.length
                                }{' '}
                                appointment
                                {filteredAppointments.length !==
                                1
                                    ? 's'
                                    : ''}
                            </Badge>

                        </Group>


                        <AppointmentCalendar
                            appointments={
                                filteredAppointments
                            }
                            currentDate={
                                safeCurrentDate
                            }
                            view={
                                calendarView
                            }
                            onDateChange={
                                handleDateChange
                            }
                            onViewChange={
                                setCalendarView
                            }
                            onAppointmentClick={
                                setSelectedAppointment
                            }
                            onMoreClick={
                                handleMoreClick
                            }
                        />

                    </Stack>
                </motion.div>


                {/* ================================================= */}
                {/* LOADING */}
                {/* ================================================= */}

                {loading && (
                    <Text
                        size="sm"
                        c="dimmed"
                        ta="center"
                    >
                        Loading
                        appointments...
                    </Text>
                )}


                {/* ================================================= */}
                {/* FILTERED EMPTY */}
                {/* ================================================= */}

                {!loading &&
                    appointments.length >
                        0 &&
                    filteredAppointments.length ===
                        0 && (
                        <Card
                            withBorder
                            radius="xl"
                            p="xl"
                        >
                            <Stack
                                align="center"
                                gap="xs"
                            >

                                <Text
                                    fw={700}
                                    size="lg"
                                >
                                    No
                                    appointments
                                    found
                                </Text>

                                <Text
                                    size="sm"
                                    c="dimmed"
                                    ta="center"
                                >
                                    Try changing
                                    your search
                                    or status
                                    filter.
                                </Text>

                            </Stack>
                        </Card>
                    )}


                {/* ================================================= */}
                {/* NO APPOINTMENTS */}
                {/* ================================================= */}

                {!loading &&
                    appointments.length ===
                        0 && (
                        <Card
                            withBorder
                            radius="xl"
                            p={40}
                        >
                            <Stack
                                align="center"
                                gap="xs"
                            >

                                <IconCalendar
                                    size={36}
                                    stroke={1.5}
                                />

                                <Text
                                    fw={700}
                                    size="lg"
                                >
                                    No
                                    appointments
                                    yet
                                </Text>

                                <Text
                                    size="sm"
                                    c="dimmed"
                                    ta="center"
                                >
                                    Appointments
                                    will appear
                                    here once
                                    patients
                                    start
                                    booking.
                                </Text>

                            </Stack>
                        </Card>
                    )}

            </Stack>


            {/* ===================================================== */}
            {/* CALENDAR OVERFLOW MODAL */}
            {/* ===================================================== */}

            <CalendarDayAppointmentsModal
                opened={
                    overflowDate !== null
                }
                onClose={
                    closeOverflowModal
                }
                date={overflowDate}
                appointments={
                    overflowAppointments
                }
                onAppointmentClick={
                    handleOverflowAppointmentClick
                }
            />


            {/* ===================================================== */}
            {/* APPOINTMENT DETAILS MODAL */}
            {/* ===================================================== */}

            <AppointmentDetailsModal
                appointment={
                    selectedAppointment
                }
                opened={
                    selectedAppointment !==
                        null
                }
                onClose={() =>
                    setSelectedAppointment(
                        null,
                    )
                }
                onStatusChange={
                    handleStatusChange
                }
                updatingId={
                    updatingId
                }
            />

        </Container>
    )
}


export default AdminAppointmentsPage
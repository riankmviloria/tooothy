import {
    Badge,
    Card,
    Container,
    Grid,
    Group,
    Loader,
    Stack,
    Text,
    Title,
} from '@mantine/core'
import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import {
    subscribeToAppointments,
    type AdminAppointment,
} from '../services/appointmentAdminService'

type StatCardProps = {
    label: string
    value: number
}

function StatCard({
    label,
    value,
}: StatCardProps) {
    return (
        <Card
            withBorder
            radius="xl"
            padding="lg"
        >
            <Stack gap="xs">
                <Text
                    size="sm"
                    c="dimmed"
                >
                    {label}
                </Text>

                <Text
                    fw={800}
                    size="2rem"
                    style={{
                        lineHeight: 1,
                        letterSpacing:
                            '-0.04em',
                    }}
                >
                    {value}
                </Text>
            </Stack>
        </Card>
    )
}

function AdminDashboardPage() {
    const [appointments, setAppointments] =
        useState<AdminAppointment[]>([])

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState<string | null>(null)

    /*
     * GET LOCAL DATE
     *
     * Avoid toISOString() because it uses UTC
     * and can produce the wrong date for users
     * in the Philippines.
     */
    const getLocalDateString = () => {
        const date =
            new Date()

        const year =
            date.getFullYear()

        const month =
            String(
                date.getMonth() + 1,
            ).padStart(2, '0')

        const day =
            String(
                date.getDate(),
            ).padStart(2, '0')

        return `${year}-${month}-${day}`
    }

    const today =
        getLocalDateString()

    /*
     * REALTIME APPOINTMENT LISTENER
     */
    useEffect(() => {
        const unsubscribe =
            subscribeToAppointments(
                (data) => {
                    setAppointments(data)
                    setLoading(false)
                },
                (error) => {
                    console.error(
                        'Failed to listen to appointments:',
                        error,
                    )

                    setError(
                        'Unable to load appointments.',
                    )

                    setLoading(false)
                },
            )

        return () => {
            unsubscribe()
        }
    }, [])

    /*
     * TODAY'S APPOINTMENTS
     */
    const todaysAppointments =
        useMemo(() => {
            return appointments
                .filter(
                    (appointment) =>
                        appointment.date ===
                        today,
                )
                .sort((a, b) =>
                    a.time.localeCompare(
                        b.time,
                    ),
                )
        }, [
            appointments,
            today,
        ])

    /*
     * PENDING COUNT
     */
    const pendingCount =
        useMemo(() => {
            return appointments.filter(
                (appointment) =>
                    appointment.status ===
                    'pending',
            ).length
        }, [appointments])

    /*
     * CONFIRMED COUNT
     */
    const confirmedCount =
        useMemo(() => {
            return appointments.filter(
                (appointment) =>
                    appointment.status ===
                    'confirmed',
            ).length
        }, [appointments])

    /*
     * THIS WEEK COUNT
     */
    const thisWeekCount =
        useMemo(() => {
            const now =
                new Date()

            const startOfWeek =
                new Date(now)

            const day =
                startOfWeek.getDay()

            /*
             * Monday = start of week.
             *
             * Sunday (0) becomes -6 days.
             */
            const difference =
                day === 0
                    ? -6
                    : 1 - day

            startOfWeek.setDate(
                startOfWeek.getDate() +
                    difference,
            )

            startOfWeek.setHours(
                0,
                0,
                0,
                0,
            )

            const endOfWeek =
                new Date(
                    startOfWeek,
                )

            endOfWeek.setDate(
                endOfWeek.getDate() +
                    7,
            )

            return appointments.filter(
                (appointment) => {
                    const appointmentDate =
                        new Date(
                            `${appointment.date}T00:00:00`,
                        )

                    return (
                        appointmentDate >=
                            startOfWeek &&
                        appointmentDate <
                            endOfWeek
                    )
                },
            ).length
        }, [appointments])

    /*
     * STATUS COLOR
     */
    const getStatusColor =
        (status: string) => {
            switch (status) {
                case 'confirmed':
                    return 'green'

                case 'completed':
                    return 'teal'

                case 'cancelled':
                    return 'red'

                default:
                    return 'yellow'
            }
        }

    /*
     * FORMAT DATE
     */
    const formatDate =
        (date: string) => {
            const value =
                new Date(
                    `${date}T00:00:00`,
                )

            return value.toLocaleDateString(
                'en-US',
                {
                    weekday:
                        'long',
                    month:
                        'long',
                    day:
                        'numeric',
                    year:
                        'numeric',
                },
            )
        }

    return (
        <Container
            size="xl"
            py="md"
        >
            <Stack gap="xl">
                {/* HEADER */}
                <Stack gap={4}>
                    <Title
                        order={1}
                        style={{
                            letterSpacing:
                                '-0.04em',
                        }}
                    >
                        Dashboard
                    </Title>

                    <Text c="dimmed">
                        Overview of your
                        clinic appointments.
                    </Text>
                </Stack>

                {/* ERROR */}
                {error && (
                    <Card
                        withBorder
                        radius="lg"
                    >
                        <Text
                            c="red"
                            size="sm"
                        >
                            {error}
                        </Text>
                    </Card>
                )}

                {/* STATISTICS */}
                <Grid>
                    <Grid.Col
                        span={{
                            base: 6,
                            sm: 6,
                            md: 3,
                        }}
                    >
                        <StatCard
                            label="Today's appointments"
                            value={
                                todaysAppointments.length
                            }
                        />
                    </Grid.Col>

                    <Grid.Col
                        span={{
                            base: 6,
                            sm: 6,
                            md: 3,
                        }}
                    >
                        <StatCard
                            label="Pending"
                            value={
                                pendingCount
                            }
                        />
                    </Grid.Col>

                    <Grid.Col
                        span={{
                            base: 6,
                            sm: 6,
                            md: 3,
                        }}
                    >
                        <StatCard
                            label="Confirmed"
                            value={
                                confirmedCount
                            }
                        />
                    </Grid.Col>

                    <Grid.Col
                        span={{
                            base: 6,
                            sm: 6,
                            md: 3,
                        }}
                    >
                        <StatCard
                            label="This week"
                            value={
                                thisWeekCount
                            }
                        />
                    </Grid.Col>
                </Grid>

                {/* TODAY */}
                <Card
                    withBorder
                    radius="xl"
                    padding="lg"
                >
                    <Stack gap="lg">
                        {/* SECTION HEADER */}
                        <Group
                            justify="space-between"
                            align="flex-start"
                        >
                            <Stack gap={2}>
                                <Title
                                    order={2}
                                    size="1.25rem"
                                >
                                    Today's
                                    appointments
                                </Title>

                                <Text
                                    size="sm"
                                    c="dimmed"
                                >
                                    {formatDate(
                                        today,
                                    )}
                                </Text>
                            </Stack>

                            {!loading && (
                                <Badge
                                    variant="light"
                                    color="smilehaos"
                                    size="lg"
                                >
                                    {
                                        todaysAppointments.length
                                    }{' '}
                                    appointment
                                    {todaysAppointments.length !==
                                        1 &&
                                        's'}
                                </Badge>
                            )}
                        </Group>

                        {/* LOADING */}
                        {loading ? (
                            <Stack
                                align="center"
                                py="xl"
                            >
                                <Loader
                                    color="smilehaos"
                                />

                                <Text
                                    size="sm"
                                    c="dimmed"
                                >
                                    Loading
                                    appointments...
                                </Text>
                            </Stack>
                        ) : todaysAppointments.length ===
                          0 ? (
                            /* EMPTY STATE */
                            <Stack
                                align="center"
                                py="xl"
                            >
                                <Text
                                    size="2rem"
                                >
                                    🦷
                                </Text>

                                <Text
                                    fw={600}
                                >
                                    No appointments
                                    today
                                </Text>

                                <Text
                                    size="sm"
                                    c="dimmed"
                                    ta="center"
                                >
                                    There are no
                                    appointments
                                    scheduled
                                    for today.
                                </Text>
                            </Stack>
                        ) : (
                            <Stack gap="sm">
                                {todaysAppointments.map(
                                    (
                                        appointment,
                                    ) => (
                                        <Card
                                            key={
                                                appointment.id
                                            }
                                            withBorder
                                            radius="lg"
                                            padding="md"
                                        >
                                            {/* DESKTOP */}
                                            <Group
                                                justify="space-between"
                                                align="center"
                                                visibleFrom="sm"
                                                wrap="nowrap"
                                            >
                                                <Stack
                                                    gap={2}
                                                    style={{
                                                        minWidth: 0,
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Group
                                                        gap="sm"
                                                        wrap="nowrap"
                                                    >
                                                        <Text
                                                            fw={700}
                                                        >
                                                            {
                                                                appointment
                                                                    .patient
                                                                    .fullName
                                                            }
                                                        </Text>

                                                        <Badge
                                                            size="sm"
                                                            variant="light"
                                                            color={getStatusColor(
                                                                appointment.status,
                                                            )}
                                                        >
                                                            {
                                                                appointment.status
                                                            }
                                                        </Badge>
                                                    </Group>

                                                    <Text
                                                        size="sm"
                                                        c="dimmed"
                                                        truncate
                                                    >
                                                        {
                                                            appointment.serviceName
                                                        }
                                                    </Text>
                                                </Stack>

                                                <Stack
                                                    gap={2}
                                                    align="flex-end"
                                                >
                                                    <Text
                                                        fw={700}
                                                    >
                                                        {
                                                            appointment.time
                                                        }
                                                    </Text>

                                                    <Text
                                                        size="xs"
                                                        c="dimmed"
                                                    >
                                                        {
                                                            appointment.duration
                                                        }{' '}
                                                        min
                                                    </Text>
                                                </Stack>
                                            </Group>

                                            {/* MOBILE */}
                                            <Stack
                                                gap="md"
                                                hiddenFrom="sm"
                                            >
                                                <Group
                                                    justify="space-between"
                                                    align="flex-start"
                                                    wrap="nowrap"
                                                >
                                                    <Stack
                                                        gap={2}
                                                        style={{
                                                            minWidth: 0,
                                                        }}
                                                    >
                                                        <Text
                                                            fw={700}
                                                        >
                                                            {
                                                                appointment
                                                                    .patient
                                                                    .fullName
                                                        }
                                                        </Text>

                                                        <Text
                                                            size="sm"
                                                            c="dimmed"
                                                            style={{
                                                                wordBreak:
                                                                    'break-word',
                                                            }}
                                                        >
                                                            {
                                                                appointment.serviceName
                                                            }
                                                        </Text>
                                                    </Stack>

                                                    <Badge
                                                        size="sm"
                                                        variant="light"
                                                        color={getStatusColor(
                                                            appointment.status,
                                                        )}
                                                    >
                                                        {
                                                            appointment.status
                                                        }
                                                    </Badge>
                                                </Group>

                                                <Group
                                                    justify="space-between"
                                                    align="center"
                                                >
                                                    <Stack
                                                        gap={0}
                                                    >
                                                        <Text
                                                            fw={700}
                                                        >
                                                            {
                                                                appointment.time
                                                            }
                                                        </Text>

                                                        <Text
                                                            size="xs"
                                                            c="dimmed"
                                                        >
                                                            {
                                                                appointment.duration
                                                            }{' '}
                                                            min
                                                        </Text>
                                                    </Stack>

                                                    <Text
                                                        fw={700}
                                                    >
                                                        ₱
                                                        {appointment.price.toLocaleString()}
                                                    </Text>
                                                </Group>
                                            </Stack>
                                        </Card>
                                    ),
                                )}
                            </Stack>
                        )}
                    </Stack>
                </Card>
            </Stack>
        </Container>
    )
}

export default AdminDashboardPage
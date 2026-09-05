import {
    Badge,
    Card,
    Container,
    Grid,
    Group,
    Loader,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core'
import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import {
    IconCalendar,
    IconCalendarCheck,
    IconClock,
    IconSparkles,
    IconUsers,
} from '@tabler/icons-react'

import { motion } from 'motion/react'

import {
    subscribeToAppointments,
    type AdminAppointment,
} from '../services/appointmentAdminService'

type StatCardProps = {
    label: string
    value: number
    description: string
    icon: React.ReactNode
}

const pageVariants = {
    initial: {
        opacity: 0,
        y: 16,
    },
    animate: {
        opacity: 1,
        y: 0,
    },
}

const pageTransition = {
    duration: 0.4,
    ease: 'easeOut' as const,
}

const staggerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
        },
    },
}

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 14,
    },
    visible: {
        opacity: 1,
        y: 0,
    },
}

function StatCard({
    label,
    value,
    description,
    icon,
}: StatCardProps) {
    return (
        <motion.div
            variants={itemVariants}
            style={{
                height: '100%',
            }}
        >
            <Card
                withBorder
                radius="xl"
                padding="lg"
                style={{
                    height: '100%',
                    borderColor:
                        'var(--mantine-color-gray-2)',
                    transition:
                        'transform 180ms ease, box-shadow 180ms ease',
                }}
            >
                <Group
                    justify="space-between"
                    align="flex-start"
                    wrap="nowrap"
                >
                    <Stack
                        gap="xs"
                        style={{
                            minWidth: 0,
                        }}
                    >
                        <Text
                            size="sm"
                            c="dimmed"
                            fw={600}
                        >
                            {label}
                        </Text>

                        <Text
                            fw={800}
                            size="2.25rem"
                            style={{
                                lineHeight: 1,
                                letterSpacing:
                                    '-0.05em',
                            }}
                        >
                            {value}
                        </Text>

                        <Text
                            size="xs"
                            c="dimmed"
                        >
                            {description}
                        </Text>
                    </Stack>

                    <ThemeIcon
                        size={44}
                        radius="xl"
                        variant="light"
                        color="smilehaos"
                    >
                        {icon}
                    </ThemeIcon>
                </Group>
            </Card>
        </motion.div>
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
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            transition={pageTransition}
        >
            <Container
                size="xl"
                py="xl"
            >
                <Stack gap="xl">

                    {/* ================================================= */}
                    {/* HEADER */}
                    {/* ================================================= */}

                    <motion.div
                        variants={staggerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Stack gap="md">

                            <Group
                                justify="space-between"
                                align="flex-end"
                                gap="xl"
                            >
                                <Stack
                                    gap={4}
                                    style={{
                                        minWidth: 0,
                                    }}
                                >
                                    <Group
                                        gap="xs"
                                    >
                                        <Badge
                                            variant="light"
                                            color="smilehaos"
                                            radius="xl"
                                        >
                                            Admin dashboard
                                        </Badge>
                                    </Group>

                                    <Title
                                        order={1}
                                        style={{
                                            letterSpacing:
                                                '-0.045em',
                                        }}
                                    >
                                        Good day,
                                        Doctor.
                                    </Title>

                                    <Text
                                        c="dimmed"
                                        size="sm"
                                    >
                                        Here’s what’s
                                        happening at
                                        SmileHaos Dental
                                        Clinic today.
                                    </Text>
                                </Stack>

                                <Paper
                                    visibleFrom="sm"
                                    withBorder
                                    radius="xl"
                                    px="md"
                                    py="sm"
                                    style={{
                                        borderColor:
                                            'var(--mantine-color-gray-2)',
                                    }}
                                >
                                    <Group
                                        gap="sm"
                                    >
                                        <ThemeIcon
                                            size={34}
                                            radius="xl"
                                            variant="light"
                                            color="smilehaos"
                                        >
                                            <IconCalendar
                                                size={18}
                                            />
                                        </ThemeIcon>

                                        <Stack gap={0}>
                                            <Text
                                                size="xs"
                                                c="dimmed"
                                                fw={600}
                                            >
                                                Today
                                            </Text>

                                            <Text
                                                size="sm"
                                                fw={700}
                                            >
                                                {new Date().toLocaleDateString(
                                                    'en-US',
                                                    {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    },
                                                )}
                                            </Text>
                                        </Stack>
                                    </Group>
                                </Paper>
                            </Group>

                        </Stack>
                    </motion.div>

                    {/* ================================================= */}
                    {/* ERROR */}
                    {/* ================================================= */}

                    {error && (
                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Card
                                withBorder
                                radius="xl"
                                padding="md"
                                style={{
                                    borderColor:
                                        'var(--mantine-color-red-2)',
                                    background:
                                        'var(--mantine-color-red-0)',
                                }}
                            >
                                <Text
                                    c="red"
                                    size="sm"
                                    fw={600}
                                >
                                    {error}
                                </Text>
                            </Card>
                        </motion.div>
                    )}

                    {/* ================================================= */}
                    {/* STATISTICS */}
                    {/* ================================================= */}

                    <motion.div
                        variants={staggerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Grid>
                            <Grid.Col
                                span={{
                                    base: 6,
                                    sm: 6,
                                    md: 3,
                                }}
                            >
                                <StatCard
                                    label="Today"
                                    value={
                                        todaysAppointments.length
                                    }
                                    description="Appointments scheduled"
                                    icon={
                                        <IconCalendarCheck
                                            size={22}
                                            stroke={1.8}
                                        />
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
                                    description="Awaiting confirmation"
                                    icon={
                                        <IconClock
                                            size={22}
                                            stroke={1.8}
                                        />
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
                                    description="Ready for treatment"
                                    icon={
                                        <IconSparkles
                                            size={22}
                                            stroke={1.8}
                                        />
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
                                    description="Total appointments"
                                    icon={
                                        <IconUsers
                                            size={22}
                                            stroke={1.8}
                                        />
                                    }
                                />
                            </Grid.Col>
                        </Grid>
                    </motion.div>

                    {/* ================================================= */}
                    {/* TODAY'S APPOINTMENTS */}
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
                            delay: 0.15,
                            ease: 'easeOut',
                        }}
                    >
                        <Card
                            withBorder
                            radius="xl"
                            padding="lg"
                            style={{
                                borderColor:
                                    'var(--mantine-color-gray-2)',
                            }}
                        >
                            <Stack gap="lg">

                                {/* SECTION HEADER */}

                                <Group
                                    justify="space-between"
                                    align="flex-start"
                                    gap="md"
                                >
                                    <Group
                                        gap="sm"
                                        wrap="nowrap"
                                    >
                                        <ThemeIcon
                                            size={44}
                                            radius="xl"
                                            variant="light"
                                            color="smilehaos"
                                        >
                                            <IconCalendar
                                                size={21}
                                                stroke={1.8}
                                            />
                                        </ThemeIcon>

                                        <Stack
                                            gap={2}
                                            style={{
                                                minWidth: 0,
                                            }}
                                        >
                                            <Title
                                                order={2}
                                                size="1.25rem"
                                                style={{
                                                    letterSpacing:
                                                        '-0.02em',
                                                }}
                                            >
                                                Today’s
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
                                    </Group>

                                    {!loading && (
                                        <Badge
                                            variant="light"
                                            color="smilehaos"
                                            size="lg"
                                            radius="xl"
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
                                        justify="center"
                                        py={60}
                                    >
                                        <Loader
                                            color="smilehaos"
                                            size="md"
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

                                    <Paper
                                        radius="xl"
                                        p="xl"
                                        style={{
                                            background:
                                                'var(--mantine-color-gray-0)',
                                        }}
                                    >
                                        <Stack
                                            align="center"
                                            justify="center"
                                            gap="sm"
                                            py="xl"
                                        >
                                            <ThemeIcon
                                                size={64}
                                                radius="xl"
                                                variant="light"
                                                color="smilehaos"
                                            >
                                                <IconSparkles
                                                    size={30}
                                                    stroke={1.6}
                                                />
                                            </ThemeIcon>

                                            <Text
                                                fw={700}
                                                size="lg"
                                            >
                                                Your schedule
                                                is clear
                                            </Text>

                                            <Text
                                                size="sm"
                                                c="dimmed"
                                                ta="center"
                                                maw={420}
                                            >
                                                There are no
                                                appointments
                                                scheduled for
                                                today.
                                            </Text>
                                        </Stack>
                                    </Paper>
                                ) : (
                                    <Stack gap="sm">
                                        {todaysAppointments.map(
                                            (
                                                appointment,
                                                index,
                                            ) => (
                                                <motion.div
                                                    key={
                                                        appointment.id
                                                    }
                                                    initial={{
                                                        opacity: 0,
                                                        y: 10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.3,
                                                        delay:
                                                            index *
                                                            0.05,
                                                        ease: 'easeOut',
                                                    }}
                                                >
                                                    <Card
                                                        withBorder
                                                        radius="lg"
                                                        padding="md"
                                                        style={{
                                                            borderColor:
                                                                'var(--mantine-color-gray-2)',
                                                        }}
                                                    >

                                                        {/* DESKTOP */}

                                                        <Group
                                                            justify="space-between"
                                                            align="center"
                                                            visibleFrom="sm"
                                                            wrap="nowrap"
                                                            gap="lg"
                                                        >
                                                            <Group
                                                                gap="md"
                                                                wrap="nowrap"
                                                                style={{
                                                                    flex: 1,
                                                                    minWidth: 0,
                                                                }}
                                                            >
                                                                <ThemeIcon
                                                                    size={42}
                                                                    radius="xl"
                                                                    variant="light"
                                                                    color="smilehaos"
                                                                >
                                                                    <IconUsers
                                                                        size={20}
                                                                        stroke={1.8}
                                                                    />
                                                                </ThemeIcon>

                                                                <Stack
                                                                    gap={3}
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
                                                                            truncate
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
                                                                            style={{
                                                                                flexShrink: 0,
                                                                            }}
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
                                                            </Group>

                                                            <Group
                                                                gap="xl"
                                                                wrap="nowrap"
                                                            >
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

                                                                <Text
                                                                    fw={700}
                                                                    miw={80}
                                                                    ta="right"
                                                                >
                                                                    ₱
                                                                    {appointment.price.toLocaleString()}
                                                                </Text>
                                                            </Group>
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
                                                                <Group
                                                                    gap="sm"
                                                                    wrap="nowrap"
                                                                    style={{
                                                                        minWidth: 0,
                                                                    }}
                                                                >
                                                                    <ThemeIcon
                                                                        size={38}
                                                                        radius="xl"
                                                                        variant="light"
                                                                        color="smilehaos"
                                                                    >
                                                                        <IconUsers
                                                                            size={18}
                                                                            stroke={1.8}
                                                                        />
                                                                    </ThemeIcon>

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
                                                                                overflowWrap:
                                                                                    'anywhere',
                                                                            }}
                                                                        >
                                                                            {
                                                                                appointment.serviceName
                                                                            }
                                                                        </Text>
                                                                    </Stack>
                                                                </Group>

                                                                <Badge
                                                                    size="sm"
                                                                    variant="light"
                                                                    color={getStatusColor(
                                                                        appointment.status,
                                                                    )}
                                                                    style={{
                                                                        flexShrink: 0,
                                                                    }}
                                                                >
                                                                    {
                                                                        appointment.status
                                                                    }
                                                                </Badge>
                                                            </Group>

                                                            <Paper
                                                                radius="lg"
                                                                p="sm"
                                                                style={{
                                                                    background:
                                                                        'var(--mantine-color-gray-0)',
                                                                }}
                                                            >
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
                                                            </Paper>
                                                        </Stack>

                                                    </Card>
                                                </motion.div>
                                            ),
                                        )}
                                    </Stack>
                                )}

                            </Stack>
                        </Card>
                    </motion.div>

                </Stack>
            </Container>
        </motion.div>
    )
}

export default AdminDashboardPage
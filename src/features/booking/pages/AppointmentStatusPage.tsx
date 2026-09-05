import {
    Alert,
    Badge,
    Button,
    Card,
    Container,
    Group,
    Loader,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core'

import {
    IconArrowLeft,
    IconCalendar,
    IconCircleCheck,
    IconCircleX,
    IconClock,
} from '@tabler/icons-react'

import {
    useEffect,
    useState,
} from 'react'

import {
    useParams,
} from 'react-router-dom'

import Brand from '../../../components/Brand'
import Footer from '../../../components/Footer'

import {
    subscribeToAppointmentTracking,
    type AppointmentTracking,
} from '../services/appointmentTrackingService'

function AppointmentStatusPage() {
    const {
        token,
    } = useParams<{
        token: string
    }>()

    const [
        appointment,
        setAppointment,
    ] = useState<AppointmentTracking | null>(
        null,
    )

    const [
        isLoading,
        setIsLoading,
    ] = useState(true)

    const [
        error,
        setError,
    ] = useState<string | null>(
        null,
    )

    useEffect(() => {
        if (!token) {
            return
        }

        const unsubscribe =
            subscribeToAppointmentTracking(
                token,
                (data) => {
                    setAppointment(data)
                    setIsLoading(false)
                    setError(null)
                },
                (error) => {
                    console.error(
                        'Appointment tracking listener failed:',
                        error,
                    )

                    setError(
                        'We could not load your appointment status.',
                    )

                    setIsLoading(false)
                },
            )

        return unsubscribe
    }, [token])

    const formattedDate = appointment?.date
        ? new Date(
            `${appointment.date}T00:00:00`,
        ).toLocaleDateString(
            'en-US',
            {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            },
        )
        : null

    if (isLoading) {
        return (
            <>
                <Container
                    size="sm"
                    py={80}
                >
                    <Stack
                        align="center"
                        gap="lg"
                    >
                        <Loader
                            color="smilehaos"
                        />

                        <Text c="dimmed">
                            Loading your appointment...
                        </Text>
                    </Stack>
                </Container>

                <Footer />
            </>
        )
    }

    if (error) {
        return (
            <>
                <Container
                    size="sm"
                    py={80}
                >
                    <Stack
                        align="center"
                        gap="lg"
                        ta="center"
                    >
                        <ThemeIcon
                            size={64}
                            radius="xl"
                            color="red"
                            variant="light"
                        >
                            <IconCircleX
                                size={32}
                            />
                        </ThemeIcon>

                        <Title order={2}>
                            Something went wrong
                        </Title>

                        <Text
                            c="dimmed"
                            maw={450}
                        >
                            {error}
                        </Text>

                        <Button
                            component="a"
                            href="/"
                            variant="light"
                        >
                            Back to SmileHaos
                        </Button>
                    </Stack>
                </Container>

                <Footer />
            </>
        )
    }

    if (!appointment) {
        return (
            <>
                <Container
                    size="sm"
                    py={80}
                >
                    <Stack
                        align="center"
                        gap="lg"
                        ta="center"
                    >
                        <ThemeIcon
                            size={64}
                            radius="xl"
                            color="red"
                            variant="light"
                        >
                            <IconCircleX
                                size={32}
                            />
                        </ThemeIcon>

                        <Title order={2}>
                            Appointment not found
                        </Title>

                        <Text
                            c="dimmed"
                            maw={450}
                        >
                            We could not find an appointment
                            associated with this tracking link.
                        </Text>

                        <Button
                            component="a"
                            href="/"
                            variant="light"
                        >
                            Back to SmileHaos
                        </Button>
                    </Stack>
                </Container>

                <Footer />
            </>
        )
    }

    return (
        <>
            <Container size="sm">
                <Group
                    justify="space-between"
                    py="lg"
                >
                    <a
                        href="/"
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        <Brand compact />
                    </a>

                    <Button
                        component="a"
                        href="/"
                        variant="subtle"
                        leftSection={
                            <IconArrowLeft
                                size={16}
                            />
                        }
                    >
                        Home
                    </Button>
                </Group>
            </Container>

            <main>
                <Container
                    size="sm"
                    py={{
                        base: 'xl',
                        sm: 60,
                    }}
                >
                    <Stack gap="xl">
                        {/* Header */}

                        <Stack
                            gap="xs"
                            ta="center"
                            align="center"
                        >
                            <Text
                                size="sm"
                                fw={700}
                                c="smilehaos.7"
                            >
                                Appointment tracking
                            </Text>

                            <Title
                                order={1}
                                size="clamp(2rem, 6vw, 3rem)"
                                style={{
                                    letterSpacing:
                                        '-0.04em',
                                }}
                            >
                                {getStatusTitle(
                                    appointment.status,
                                )}
                            </Title>

                            <Text
                                c="dimmed"
                                maw={500}
                            >
                                {getStatusDescription(
                                    appointment.status,
                                )}
                            </Text>
                        </Stack>

                        {/* Status */}

                        <Card
                            withBorder
                            radius="xl"
                            padding="xl"
                        >
                            <Stack
                                align="center"
                                gap="md"
                                ta="center"
                            >
                                <ThemeIcon
                                    size={72}
                                    radius="xl"
                                    color={getStatusColor(
                                        appointment.status,
                                    )}
                                    variant="light"
                                >
                                    {getStatusIcon(
                                        appointment.status,
                                    )}
                                </ThemeIcon>

                                <Badge
                                    size="lg"
                                    color={getStatusColor(
                                        appointment.status,
                                    )}
                                    variant="light"
                                >
                                    {getStatusLabel(
                                        appointment.status,
                                    )}
                                </Badge>

                                {appointment.status ===
                                    'cancelled' &&
                                    appointment.cancellationReason && (
                                        <Alert
                                            color="red"
                                            title="Cancellation reason"
                                            w="100%"
                                        >
                                            {
                                                appointment.cancellationReason
                                            }
                                        </Alert>
                                    )}
                            </Stack>
                        </Card>

                        {/* Appointment Details */}

                        <Card
                            withBorder
                            radius="xl"
                            padding="xl"
                        >
                            <Stack gap="lg">
                                <Stack gap={2}>
                                    <Text
                                        size="xs"
                                        c="dimmed"
                                        fw={700}
                                        tt="uppercase"
                                    >
                                        Appointment reference
                                    </Text>

                                    <Text
                                        size="xl"
                                        fw={800}
                                        style={{
                                            letterSpacing:
                                                '0.03em',
                                        }}
                                    >
                                        {
                                            appointment.appointmentNumber
                                        }
                                    </Text>
                                </Stack>

                                <Group
                                    wrap="nowrap"
                                >
                                    <ThemeIcon
                                        size={44}
                                        radius="md"
                                        color="smilehaos"
                                        variant="light"
                                    >
                                        🦷
                                    </ThemeIcon>

                                    <Stack gap={2}>
                                        <Text fw={700}>
                                            {
                                                appointment.serviceName
                                            }
                                        </Text>

                                        <Text
                                            size="sm"
                                            c="dimmed"
                                        >
                                            {
                                                appointment.duration
                                            }{' '}
                                            minutes
                                        </Text>
                                    </Stack>
                                </Group>

                                <Stack gap="sm">
                                    <Group
                                        gap="sm"
                                        wrap="nowrap"
                                    >
                                        <IconCalendar
                                            size={20}
                                            stroke={1.7}
                                        />

                                        <Text>
                                            {formattedDate}
                                        </Text>
                                    </Group>

                                    <Group
                                        gap="sm"
                                        wrap="nowrap"
                                    >
                                        <IconClock
                                            size={20}
                                            stroke={1.7}
                                        />

                                        <Text>
                                            {
                                                appointment.time
                                            }
                                        </Text>
                                    </Group>
                                </Stack>

                                <Group
                                    justify="space-between"
                                >
                                    <Text c="dimmed">
                                        Estimated fee
                                    </Text>

                                    <Text
                                        fw={800}
                                        size="xl"
                                        c="smilehaos.7"
                                        ta="right"
                                    >
                                        {appointment.priceLabel ??
                                            'Consultation required'}
                                    </Text>
                                </Group>
                            </Stack>
                        </Card>

                        {/* Back */}

                        <Button
                            component="a"
                            href="/"
                            variant="light"
                            size="lg"
                            fullWidth
                        >
                            Back to SmileHaos
                        </Button>

                        <Text
                            size="xs"
                            c="dimmed"
                            ta="center"
                        >
                            Keep this page or your appointment
                            reference for future status checks.
                        </Text>
                    </Stack>
                </Container>
            </main>

            <Footer />
        </>
    )
}

function getStatusLabel(
    status: AppointmentTracking['status'],
) {
    switch (status) {
        case 'confirmed':
            return 'Confirmed'

        case 'completed':
            return 'Completed'

        case 'cancelled':
            return 'Cancelled'

        default:
            return 'Pending'
    }
}

function getStatusTitle(
    status: AppointmentTracking['status'],
) {
    switch (status) {
        case 'confirmed':
            return 'Your appointment is confirmed'

        case 'completed':
            return 'Appointment completed'

        case 'cancelled':
            return 'Your appointment was cancelled'

        default:
            return 'Waiting for confirmation'
    }
}

function getStatusDescription(
    status: AppointmentTracking['status'],
) {
    switch (status) {
        case 'confirmed':
            return 'The clinic has confirmed your appointment. We look forward to seeing you.'

        case 'completed':
            return 'Thank you for visiting SmileHaos Dental Clinic.'

        case 'cancelled':
            return 'This appointment is no longer scheduled.'

        default:
            return 'Your appointment request has been received and is waiting for clinic confirmation.'
    }
}

function getStatusColor(
    status: AppointmentTracking['status'],
) {
    switch (status) {
        case 'confirmed':
            return 'green'

        case 'completed':
            return 'blue'

        case 'cancelled':
            return 'red'

        default:
            return 'yellow'
    }
}

function getStatusIcon(
    status: AppointmentTracking['status'],
) {
    switch (status) {
        case 'confirmed':
        case 'completed':
            return (
                <IconCircleCheck
                    size={36}
                />
            )

        case 'cancelled':
            return (
                <IconCircleX
                    size={36}
                />
            )

        default:
            return (
                <IconClock
                    size={36}
                />
            )
    }
}

export default AppointmentStatusPage
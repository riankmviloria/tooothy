import {
    Alert,
    Badge,
    Box,
    Button,
    Card,
    Container,
    Divider,
    Flex,
    Group,
    Loader,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core'

import { motion } from 'motion/react'

import {
    IconArrowLeft,
    IconCalendar,
    IconCheck,
    IconCircleCheck,
    IconCircleX,
    IconClock,
    IconHome,
    IconSparkles,
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
        ).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        })
        : null

    /* =========================================================
        LOADING
    ========================================================= */

    if (isLoading) {
        return (
            <>
                <Container
                    size="sm"
                    py="xl"
                >
                    <Stack
                        align="center"
                        justify="center"
                        gap="xl"
                        mih={500}
                    >
                        <motion.div
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        >
                            <ThemeIcon
                                size={78}
                                radius="50%"
                                color="smilehaos"
                                variant="light"
                            >
                                <IconSparkles size={36} />
                            </ThemeIcon>
                        </motion.div>

                        <Stack
                            align="center"
                            gap={4}
                        >
                            <Title order={3}>
                                Checking your appointment...
                            </Title>

                            <Text
                                c="dimmed"
                                ta="center"
                            >
                                Just a moment while we load the latest
                                status.
                            </Text>
                        </Stack>

                        <Loader color="smilehaos" />
                    </Stack>
                </Container>

                <Footer />
            </>
        )
    }

    /* =========================================================
        ERROR
    ========================================================= */

    if (error) {
        return (
            <>
                <Container
                    size="sm"
                    py="xl"
                >
                    <Stack
                        align="center"
                        justify="center"
                        gap="xl"
                        mih={500}
                        ta="center"
                    >
                        <motion.div
                            initial={{
                                scale: 0.6,
                                opacity: 0,
                            }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                            }}
                        >
                            <ThemeIcon
                                size={86}
                                radius="50%"
                                color="red"
                                variant="light"
                            >
                                <IconCircleX size={42} />
                            </ThemeIcon>
                        </motion.div>

                        <Stack
                            align="center"
                            gap="sm"
                        >
                            <Title order={2}>
                                Something went wrong
                            </Title>

                            <Text
                                c="dimmed"
                                maw={450}
                            >
                                {error}
                            </Text>
                        </Stack>

                        <Button
                            component="a"
                            href="/"
                            size="lg"
                            radius="xl"
                            variant="light"
                            color="smilehaos"
                            leftSection={
                                <IconHome size={19} />
                            }
                        >
                            Back to SmileHaos
                        </Button>
                    </Stack>
                </Container>

                <Footer />
            </>
        )
    }

    /* =========================================================
        NOT FOUND
    ========================================================= */

    if (!appointment) {
        return (
            <>
                <Container
                    size="sm"
                    py="xl"
                >
                    <Stack
                        align="center"
                        justify="center"
                        gap="xl"
                        mih={500}
                        ta="center"
                    >
                        <ThemeIcon
                            size={86}
                            radius="50%"
                            color="red"
                            variant="light"
                        >
                            <IconCircleX size={42} />
                        </ThemeIcon>

                        <Stack
                            align="center"
                            gap="sm"
                        >
                            <Title order={2}>
                                Appointment not found
                            </Title>

                            <Text
                                c="dimmed"
                                maw={450}
                            >
                                We could not find an appointment associated
                                with this tracking link.
                            </Text>
                        </Stack>

                        <Button
                            component="a"
                            href="/"
                            size="lg"
                            radius="xl"
                            variant="light"
                            leftSection={
                                <IconHome size={19} />
                            }
                        >
                            Back to SmileHaos
                        </Button>
                    </Stack>
                </Container>

                <Footer />
            </>
        )
    }

    const statusColor = getStatusColor(
        appointment.status,
    )

    const statusLabel = getStatusLabel(
        appointment.status,
    )

    const isConfirmed =
        appointment.status === 'confirmed'

    const isCompleted =
        appointment.status === 'completed'

    const isCancelled =
        appointment.status === 'cancelled'

    return (
        <>
            {/* =====================================================
          HEADER
      ===================================================== */}

            <BoxHeader />

            <main>
                <Container
                    size="lg"
                    py="xl"
                >
                    <Stack gap={32}>
                        {/* =================================================
                HERO
            ================================================= */}

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
                            }}
                        >
                            <Stack
                                align="center"
                                gap="md"
                                ta="center"
                            >
                                <Badge
                                    color="smilehaos"
                                    variant="light"
                                    size="lg"
                                    radius="xl"
                                    leftSection={
                                        <IconSparkles size={14} />
                                    }
                                >
                                    Appointment tracking
                                </Badge>

                                <Title
                                    order={1}
                                    size="clamp(2.8rem, 7vw, 5.5rem)"
                                    style={{
                                        lineHeight: 0.95,
                                        letterSpacing: '-0.055em',
                                    }}
                                >
                                    {getStatusTitle(
                                        appointment.status,
                                    )}
                                </Title>

                                <Text
                                    size="xl"
                                    c="dimmed"
                                    maw={680}
                                    lh={1.6}
                                >
                                    {getStatusDescription(
                                        appointment.status,
                                    )}
                                </Text>
                            </Stack>
                        </motion.div>

                        {/* =================================================
                STATUS HERO CARD
            ================================================= */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.97,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            transition={{
                                delay: 0.15,
                                duration: 0.6,
                            }}
                        >
                            <Paper
                                radius={32}
                                p="xl"
                                withBorder
                                style={{
                                    position: 'relative',
                                    overflow: 'hidden',
                                    background: '#ffffff',
                                    borderColor:
                                        'var(--mantine-color-gray-2)',
                                    boxShadow:
                                        '0 35px 100px rgba(0, 0, 0, 0.09)',
                                }}
                            >
                                {/* Background glow */}

                                <motion.div
                                    animate={{
                                        scale: [1, 1.08, 1],
                                        rotate: [0, 8, 0],
                                    }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    style={{
                                        position: 'absolute',
                                        width: 320,
                                        height: 320,
                                        borderRadius: '50%',
                                        background:
                                            `var(--mantine-color-${statusColor}-0)`,
                                        right: -170,
                                        top: -180,
                                        pointerEvents: 'none',
                                    }}
                                />

                                <Stack
                                    align="center"
                                    gap="lg"
                                    style={{
                                        position: 'relative',
                                        zIndex: 1,
                                    }}
                                >
                                    {/* Status icon */}

                                    <motion.div
                                        initial={{
                                            scale: 0.5,
                                            opacity: 0,
                                        }}
                                        animate={{
                                            scale: 1,
                                            opacity: 1,
                                        }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 180,
                                            damping: 13,
                                            delay: 0.25,
                                        }}
                                    >
                                        <ThemeIcon
                                            size={104}
                                            radius="50%"
                                            color={statusColor}
                                            variant="light"
                                            style={{
                                                boxShadow:
                                                    '0 20px 55px rgba(0, 0, 0, 0.10)',
                                            }}
                                        >
                                            {getStatusIcon(
                                                appointment.status,
                                            )}
                                        </ThemeIcon>
                                    </motion.div>

                                    <Badge
                                        size="xl"
                                        radius="xl"
                                        color={statusColor}
                                        variant="light"
                                    >
                                        {statusLabel}
                                    </Badge>

                                    {appointment.status ===
                                        'cancelled' &&
                                        appointment.cancellationReason && (
                                            <Alert
                                                color="red"
                                                title="Cancellation reason"
                                                radius="xl"
                                                w="100%"
                                                maw={700}
                                            >
                                                {
                                                    appointment.cancellationReason
                                                }
                                            </Alert>
                                        )}

                                    {/* Status-specific message */}

                                    {isConfirmed && (
                                        <Text
                                            ta="center"
                                            c="dimmed"
                                            maw={550}
                                            lh={1.6}
                                        >
                                            Your appointment has been confirmed
                                            by the clinic. We'll see you soon! ✨
                                        </Text>
                                    )}

                                    {isCompleted && (
                                        <Text
                                            ta="center"
                                            c="dimmed"
                                            maw={550}
                                            lh={1.6}
                                        >
                                            Thank you for visiting SmileHaos
                                            Dental Clinic. We hope you left with
                                            an even brighter smile.
                                        </Text>
                                    )}

                                    {!isConfirmed &&
                                        !isCompleted &&
                                        !isCancelled && (
                                            <Text
                                                ta="center"
                                                c="dimmed"
                                                maw={550}
                                                lh={1.6}
                                            >
                                                Your request is safely with the
                                                clinic. This page will automatically
                                                reflect any status updates.
                                            </Text>
                                        )}
                                </Stack>
                            </Paper>
                        </motion.div>

                        {/* =================================================
                APPOINTMENT DETAILS
            ================================================= */}

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
                                delay: 0.3,
                                duration: 0.6,
                            }}
                        >
                            <Paper
                                radius={32}
                                p="xl"
                                withBorder
                                style={{
                                    background: '#ffffff',
                                    borderColor:
                                        'var(--mantine-color-gray-2)',
                                    boxShadow:
                                        '0 25px 75px rgba(0, 0, 0, 0.07)',
                                }}
                            >
                                <Stack gap="xl">
                                    {/* Header */}

                                    <Flex
                                        justify="space-between"
                                        align="center"
                                        gap="md"
                                        wrap="wrap"
                                    >
                                        <Group gap="md">
                                            <ThemeIcon
                                                size={54}
                                                radius="xl"
                                                variant="light"
                                                color="smilehaos"
                                            >
                                                <IconCalendar
                                                    size={27}
                                                />
                                            </ThemeIcon>

                                            <Stack gap={2}>
                                                <Text
                                                    fw={800}
                                                    size="lg"
                                                >
                                                    Your appointment
                                                </Text>

                                                <Text
                                                    size="sm"
                                                    c="dimmed"
                                                >
                                                    Appointment details
                                                </Text>
                                            </Stack>
                                        </Group>

                                        <Badge
                                            color="smilehaos"
                                            variant="light"
                                            radius="xl"
                                            size="lg"
                                        >
                                            {appointment.appointmentNumber}
                                        </Badge>
                                    </Flex>

                                    <Divider />

                                    {/* Service */}

                                    <Card
                                        radius="xl"
                                        padding="lg"
                                        style={{
                                            background:
                                                'var(--mantine-color-smilehaos-0)',
                                            border:
                                                '1px solid var(--mantine-color-smilehaos-2)',
                                        }}
                                    >
                                        <Flex
                                            justify="space-between"
                                            align="center"
                                            gap="lg"
                                            wrap="wrap"
                                        >
                                            <Group gap="md">
                                                <ThemeIcon
                                                    size={58}
                                                    radius="lg"
                                                    variant="filled"
                                                    color="smilehaos"
                                                >
                                                    🦷
                                                </ThemeIcon>

                                                <Stack gap={3}>
                                                    <Text
                                                        size="xs"
                                                        c="dimmed"
                                                        tt="uppercase"
                                                        fw={700}
                                                        style={{
                                                            letterSpacing:
                                                                '0.08em',
                                                        }}
                                                    >
                                                        Service
                                                    </Text>

                                                    <Text
                                                        fw={900}
                                                        size="xl"
                                                    >
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

                                            <Stack
                                                gap={2}
                                                align="flex-end"
                                            >
                                                <Text
                                                    size="xs"
                                                    c="dimmed"
                                                    tt="uppercase"
                                                    fw={700}
                                                >
                                                    Estimated fee
                                                </Text>

                                                <Text
                                                    fw={900}
                                                    size="xl"
                                                    c="smilehaos.7"
                                                >
                                                    {appointment.priceLabel ??
                                                        'Consultation required'}
                                                </Text>
                                            </Stack>
                                        </Flex>
                                    </Card>

                                    {/* Date + Time */}

                                    <SimpleGrid
                                        cols={{
                                            base: 1,
                                            xs: 2,
                                        }}
                                        spacing="md"
                                    >
                                        <Card
                                            radius="xl"
                                            padding="lg"
                                            withBorder
                                        >
                                            <Stack gap="sm">
                                                <Group gap="xs">
                                                    <ThemeIcon
                                                        size={36}
                                                        radius="md"
                                                        color="smilehaos"
                                                        variant="light"
                                                    >
                                                        <IconCalendar
                                                            size={19}
                                                        />
                                                    </ThemeIcon>

                                                    <Text
                                                        size="xs"
                                                        fw={800}
                                                        c="dimmed"
                                                        tt="uppercase"
                                                    >
                                                        Date
                                                    </Text>
                                                </Group>

                                                <Text
                                                    fw={700}
                                                    lh={1.4}
                                                >
                                                    {formattedDate}
                                                </Text>
                                            </Stack>
                                        </Card>

                                        <Card
                                            radius="xl"
                                            padding="lg"
                                            withBorder
                                        >
                                            <Stack gap="sm">
                                                <Group gap="xs">
                                                    <ThemeIcon
                                                        size={36}
                                                        radius="md"
                                                        color="smilehaos"
                                                        variant="light"
                                                    >
                                                        <IconClock
                                                            size={19}
                                                        />
                                                    </ThemeIcon>

                                                    <Text
                                                        size="xs"
                                                        fw={800}
                                                        c="dimmed"
                                                        tt="uppercase"
                                                    >
                                                        Time
                                                    </Text>
                                                </Group>

                                                <Text
                                                    fw={700}
                                                    size="lg"
                                                >
                                                    {appointment.time}
                                                </Text>
                                            </Stack>
                                        </Card>
                                    </SimpleGrid>

                                    {/* Reference */}

                                    <Card
                                        radius="xl"
                                        padding="lg"
                                        withBorder
                                    >
                                        <Flex
                                            justify="space-between"
                                            align="center"
                                            gap="md"
                                            wrap="wrap"
                                        >
                                            <Stack gap={2}>
                                                <Text
                                                    size="xs"
                                                    c="dimmed"
                                                    tt="uppercase"
                                                    fw={700}
                                                >
                                                    Appointment reference
                                                </Text>

                                                <Text
                                                    fw={900}
                                                    size="xl"
                                                    style={{
                                                        letterSpacing:
                                                            '0.04em',
                                                    }}
                                                >
                                                    {
                                                        appointment.appointmentNumber
                                                    }
                                                </Text>
                                            </Stack>

                                            <ThemeIcon
                                                size={48}
                                                radius="xl"
                                                color="smilehaos"
                                                variant="light"
                                            >
                                                <IconCheck
                                                    size={24}
                                                />
                                            </ThemeIcon>
                                        </Flex>
                                    </Card>
                                </Stack>
                            </Paper>
                        </motion.div>

                        {/* =================================================
                LIVE STATUS NOTE
            ================================================= */}

                        {!isCancelled && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                }}
                                transition={{
                                    delay: 0.45,
                                }}
                            >
                                <Card
                                    radius="xl"
                                    padding="xl"
                                    withBorder
                                    style={{
                                        background:
                                            'var(--mantine-color-gray-0)',
                                    }}
                                >
                                    <Group
                                        align="flex-start"
                                        gap="md"
                                        wrap="nowrap"
                                    >
                                        <ThemeIcon
                                            size={48}
                                            radius="xl"
                                            color="smilehaos"
                                            variant="light"
                                        >
                                            <IconSparkles
                                                size={23}
                                            />
                                        </ThemeIcon>

                                        <Stack gap={5}>
                                            <Text
                                                fw={800}
                                            >
                                                Live appointment updates
                                            </Text>

                                            <Text
                                                size="sm"
                                                c="dimmed"
                                                lh={1.6}
                                            >
                                                This page listens for updates from
                                                the clinic automatically. You don't
                                                need to refresh it.
                                            </Text>
                                        </Stack>
                                    </Group>
                                </Card>
                            </motion.div>
                        )}

                        {/* =================================================
                ACTIONS
            ================================================= */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 15,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: 0.55,
                            }}
                        >
                            <Stack
                                align="center"
                                gap="md"
                            >
                                <Button
                                    component="a"
                                    href="/"
                                    size="xl"
                                    radius="xl"
                                    color="smilehaos"
                                    fullWidth
                                    maw={850}
                                    leftSection={
                                        <IconHome size={21} />
                                    }
                                >
                                    Back to SmileHaos
                                </Button>

                                <Text
                                    size="xs"
                                    c="dimmed"
                                    ta="center"
                                    maw={600}
                                    lh={1.5}
                                >
                                    Keep this page or your appointment
                                    reference for future status checks.
                                </Text>
                            </Stack>
                        </motion.div>
                    </Stack>
                </Container>
            </main>

            <Footer />
        </>
    )
}

/* =============================================================
   HEADER
============================================================= */

function BoxHeader() {
    return (
        <Box
            component="header"
            style={{
                borderBottom:
                    '1px solid var(--mantine-color-gray-2)',
                background:
                    'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(18px)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}
        >
            <Container
                size="lg"
                py="md"
            >
                <Flex
                    justify="space-between"
                    align="center"
                    gap="md"
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
                        color="gray"
                        leftSection={
                            <IconArrowLeft size={17} />
                        }
                    >
                        Home
                    </Button>
                </Flex>
            </Container>
        </Box>
    )
}

/* =============================================================
   STATUS HELPERS
============================================================= */

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
                    size={48}
                />
            )

        case 'cancelled':
            return (
                <IconCircleX
                    size={48}
                />
            )

        default:
            return (
                <IconClock
                    size={48}
                />
            )
    }
}

export default AppointmentStatusPage
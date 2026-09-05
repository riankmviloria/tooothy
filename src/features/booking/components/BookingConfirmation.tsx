import {
    Badge,
    Button,
    Card,
    Container,
    Divider,
    Flex,
    Group,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core'
import { motion } from 'motion/react'
import {
    IconArrowRight,
    IconCalendar,
    IconCheck,
    IconClock,
    IconHome,
    IconSparkles,
    IconUser,
} from '@tabler/icons-react'
import { useEffect } from 'react'

import type { Service } from '../../services/types/service.types'

type BookingConfirmationProps = {
    selectedService: Service | null
    selectedDate: string | null
    selectedTime: string | null
    fullName: string
    appointmentNumber: string | null
    trackingToken: string | null
    onBackHome: () => void
}

function BookingConfirmation({
    selectedService,
    selectedDate,
    selectedTime,
    fullName,
    appointmentNumber,
    trackingToken,
}: BookingConfirmationProps) {
    /*
     * ============================================================
     * SCROLL TO TOP
     * ============================================================
     *
     * The confirmation screen is the end of the booking flow.
     * When it appears, make sure the user starts at the top of
     * the confirmation page instead of remaining at the scroll
     * position from the patient details screen.
     */

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        })

        document.documentElement.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        })

        document.body.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        })
    }, [])

    const trackingUrl = trackingToken
        ? `/appointment/${trackingToken}`
        : null

    const formattedDate = selectedDate
        ? new Date(
            `${selectedDate}T00:00:00`,
        ).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        })
        : null

    return (
        <main>
            <Container
                size="lg"
                py="xl"
            >
                <Stack
                    align="center"
                    gap={32}
                >
                    {/* =====================================================
              CELEBRATION
          ===================================================== */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.4,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 180,
                            damping: 12,
                        }}
                    >
                        <div
                            style={{
                                position: 'relative',
                                width: 150,
                                height: 150,
                            }}
                        >
                            {/* Outer orbit */}

                            <motion.div
                                animate={{
                                    rotate: 360,
                                }}
                                transition={{
                                    duration: 12,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    borderRadius: '50%',
                                    border:
                                        '2px dashed var(--mantine-color-smilehaos-3)',
                                }}
                            />

                            {/* Glow */}

                            <motion.div
                                animate={{
                                    scale: [1, 1.12, 1],
                                    opacity: [0.5, 0.8, 0.5],
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                style={{
                                    position: 'absolute',
                                    width: 120,
                                    height: 120,
                                    top: 15,
                                    left: 15,
                                    borderRadius: '50%',
                                    background:
                                        'var(--mantine-color-smilehaos-0)',
                                }}
                            />

                            {/* Main check */}

                            <ThemeIcon
                                size={92}
                                radius="50%"
                                color="smilehaos"
                                variant="filled"
                                style={{
                                    position: 'absolute',
                                    top: 29,
                                    left: 29,
                                    zIndex: 2,
                                    boxShadow:
                                        '0 20px 55px rgba(0, 0, 0, 0.16)',
                                }}
                            >
                                <IconCheck
                                    size={48}
                                    stroke={2.5}
                                />
                            </ThemeIcon>

                            {/* Sparkle */}

                            <motion.div
                                animate={{
                                    y: [0, -8, 0],
                                    rotate: [0, 15, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: 2,
                                    zIndex: 3,
                                }}
                            >
                                <IconSparkles
                                    size={30}
                                    color="var(--mantine-color-smilehaos-6)"
                                />
                            </motion.div>

                            <motion.div
                                animate={{
                                    y: [0, 7, 0],
                                    rotate: [0, -12, 0],
                                }}
                                transition={{
                                    duration: 2.4,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    bottom: 10,
                                    zIndex: 3,
                                }}
                            >
                                <IconSparkles
                                    size={22}
                                    color="var(--mantine-color-smilehaos-5)"
                                />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* =====================================================
              HERO
          ===================================================== */}

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
                            delay: 0.15,
                            duration: 0.6,
                        }}
                    >
                        <Stack
                            align="center"
                            gap="md"
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
                                Appointment request received
                            </Badge>

                            <Title
                                order={1}
                                ta="center"
                                size="clamp(3rem, 8vw, 6.5rem)"
                                style={{
                                    lineHeight: 0.9,
                                    letterSpacing: '-0.06em',
                                }}
                            >
                                You're
                                <br />

                                <Text
                                    component="span"
                                    inherit
                                    c="smilehaos.6"
                                >
                                    all set!
                                </Text>
                            </Title>

                            <Text
                                ta="center"
                                size="xl"
                                c="dimmed"
                                maw={650}
                                lh={1.6}
                            >
                                {fullName
                                    ? `Thanks, ${fullName.split(' ')[0]}!`
                                    : 'Thanks for booking with us!'}{' '}
                                Your appointment request has been
                                successfully submitted.
                            </Text>
                        </Stack>
                    </motion.div>

                    {/* =====================================================
              APPOINTMENT CARD
          ===================================================== */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 35,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.3,
                            duration: 0.7,
                        }}
                        style={{
                            width: '100%',
                            maxWidth: 850,
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
                                    '0 35px 100px rgba(0, 0, 0, 0.10)',
                            }}
                        >
                            {/* Decorative orb */}

                            <motion.div
                                animate={{
                                    rotate: [0, 10, 0],
                                    scale: [1, 1.08, 1],
                                }}
                                transition={{
                                    duration: 9,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                style={{
                                    position: 'absolute',
                                    width: 300,
                                    height: 300,
                                    borderRadius: '50%',
                                    background:
                                        'var(--mantine-color-smilehaos-0)',
                                    right: -160,
                                    top: -170,
                                    pointerEvents: 'none',
                                }}
                            />

                            <Stack
                                gap="xl"
                                style={{
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                            >
                                {/* Header */}

                                <Flex
                                    justify="space-between"
                                    align="center"
                                    gap="md"
                                    wrap="wrap"
                                >
                                    <Group gap="md">
                                        <ThemeIcon
                                            size={58}
                                            radius="xl"
                                            variant="light"
                                            color="smilehaos"
                                        >
                                            <IconCalendar
                                                size={29}
                                            />
                                        </ThemeIcon>

                                        <Stack gap={2}>
                                            <Text
                                                fw={800}
                                                size="lg"
                                            >
                                                Appointment details
                                            </Text>

                                            <Text
                                                size="sm"
                                                c="dimmed"
                                            >
                                                SmileHaos Dental Clinic
                                            </Text>
                                        </Stack>
                                    </Group>

                                    <Badge
                                        color="yellow"
                                        variant="light"
                                        size="lg"
                                        radius="xl"
                                    >
                                        PENDING
                                    </Badge>
                                </Flex>

                                <Divider />

                                {/* Appointment reference */}

                                {appointmentNumber && (
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
                                        <Stack
                                            align="center"
                                            gap={4}
                                        >
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
                                                Appointment reference
                                            </Text>

                                            <Text
                                                fw={900}
                                                size="2rem"
                                                c="smilehaos.7"
                                                style={{
                                                    letterSpacing:
                                                        '0.04em',
                                                }}
                                            >
                                                {appointmentNumber}
                                            </Text>
                                        </Stack>
                                    </Card>
                                )}

                                {/* Service */}

                                <Card
                                    radius="xl"
                                    padding="lg"
                                    withBorder
                                >
                                    <Group
                                        justify="space-between"
                                        align="center"
                                        gap="md"
                                        wrap="wrap"
                                    >
                                        <Group gap="md">
                                            <ThemeIcon
                                                variant="light"
                                                color="smilehaos"
                                                size={54}
                                                radius="lg"
                                            >
                                                {selectedService?.icon}
                                            </ThemeIcon>

                                            <Stack gap={3}>
                                                <Text
                                                    size="xs"
                                                    c="dimmed"
                                                    tt="uppercase"
                                                    fw={700}
                                                >
                                                    Service
                                                </Text>

                                                <Text
                                                    fw={800}
                                                    size="lg"
                                                >
                                                    {selectedService?.name}
                                                </Text>

                                                <Text
                                                    size="sm"
                                                    c="dimmed"
                                                >
                                                    {selectedService?.duration}{' '}
                                                    minutes
                                                </Text>
                                            </Stack>
                                        </Group>

                                        <Text
                                            fw={900}
                                            size="xl"
                                            c="smilehaos.7"
                                        >
                                            {selectedService?.priceLabel ??
                                                'Consultation required'}
                                        </Text>
                                    </Group>
                                </Card>

                                {/* Date / Time / Patient */}

                                <Stack gap="sm">
                                    <Text
                                        size="sm"
                                        fw={800}
                                        tt="uppercase"
                                        c="dimmed"
                                        style={{
                                            letterSpacing:
                                                '0.08em',
                                        }}
                                    >
                                        Your visit
                                    </Text>

                                    <Card
                                        radius="xl"
                                        padding="lg"
                                        withBorder
                                    >
                                        <Stack gap="lg">
                                            {/* Date */}

                                            <Group
                                                gap="md"
                                                wrap="nowrap"
                                            >
                                                <ThemeIcon
                                                    size={46}
                                                    radius="lg"
                                                    variant="light"
                                                    color="smilehaos"
                                                >
                                                    <IconCalendar
                                                        size={23}
                                                    />
                                                </ThemeIcon>

                                                <Stack gap={2}>
                                                    <Text
                                                        size="xs"
                                                        c="dimmed"
                                                        fw={700}
                                                        tt="uppercase"
                                                    >
                                                        Date
                                                    </Text>

                                                    <Text fw={700}>
                                                        {formattedDate}
                                                    </Text>
                                                </Stack>
                                            </Group>

                                            <Divider />

                                            {/* Time */}

                                            <Group
                                                gap="md"
                                                wrap="nowrap"
                                            >
                                                <ThemeIcon
                                                    size={46}
                                                    radius="lg"
                                                    variant="light"
                                                    color="smilehaos"
                                                >
                                                    <IconClock
                                                        size={23}
                                                    />
                                                </ThemeIcon>

                                                <Stack gap={2}>
                                                    <Text
                                                        size="xs"
                                                        c="dimmed"
                                                        fw={700}
                                                        tt="uppercase"
                                                    >
                                                        Time
                                                    </Text>

                                                    <Text fw={700}>
                                                        {selectedTime}
                                                    </Text>
                                                </Stack>
                                            </Group>

                                            <Divider />

                                            {/* Patient */}

                                            <Group
                                                gap="md"
                                                wrap="nowrap"
                                            >
                                                <ThemeIcon
                                                    size={46}
                                                    radius="lg"
                                                    variant="light"
                                                    color="smilehaos"
                                                >
                                                    <IconUser
                                                        size={23}
                                                    />
                                                </ThemeIcon>

                                                <Stack gap={2}>
                                                    <Text
                                                        size="xs"
                                                        c="dimmed"
                                                        fw={700}
                                                        tt="uppercase"
                                                    >
                                                        Patient
                                                    </Text>

                                                    <Text fw={700}>
                                                        {fullName}
                                                    </Text>
                                                </Stack>
                                            </Group>
                                        </Stack>
                                    </Card>
                                </Stack>

                                {/* Price note */}

                                <Stack gap={4}>
                                    <Flex
                                        justify="space-between"
                                        align="center"
                                    >
                                        <Text c="dimmed">
                                            Estimated price
                                        </Text>

                                        <Text
                                            fw={900}
                                            size="xl"
                                            c="smilehaos.7"
                                        >
                                            {selectedService?.priceLabel ??
                                                'Consultation required'}
                                        </Text>
                                    </Flex>

                                    <Text
                                        size="xs"
                                        c="dimmed"
                                        ta="right"
                                        lh={1.5}
                                    >
                                        Final price may vary depending on
                                        the dentist's consultation,
                                        assessment, and treatment
                                        requirements.
                                    </Text>
                                </Stack>
                            </Stack>
                        </Paper>
                    </motion.div>

                    {/* =====================================================
              PENDING MESSAGE
          ===================================================== */}

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
                            delay: 0.45,
                            duration: 0.6,
                        }}
                        style={{
                            width: '100%',
                            maxWidth: 850,
                        }}
                    >
                        <Card
                            radius="xl"
                            padding="xl"
                            withBorder
                            style={{
                                background:
                                    'var(--mantine-color-yellow-0)',
                                borderColor:
                                    'var(--mantine-color-yellow-3)',
                            }}
                        >
                            <Group
                                align="flex-start"
                                gap="md"
                                wrap="nowrap"
                            >
                                <ThemeIcon
                                    size={50}
                                    radius="xl"
                                    color="yellow"
                                    variant="light"
                                >
                                    <IconClock size={25} />
                                </ThemeIcon>

                                <Stack gap={5}>
                                    <Text
                                        fw={800}
                                        size="md"
                                    >
                                        Waiting for clinic confirmation
                                    </Text>

                                    <Text
                                        size="sm"
                                        c="dimmed"
                                        lh={1.6}
                                    >
                                        Your appointment request has been
                                        received. The clinic will review
                                        your request and confirm your
                                        appointment.
                                    </Text>
                                </Stack>
                            </Group>
                        </Card>
                    </motion.div>

                    {/* =====================================================
              TRACKING CTA
          ===================================================== */}

                    {trackingUrl && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.95,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            transition={{
                                delay: 0.55,
                                duration: 0.5,
                            }}
                            style={{
                                width: '100%',
                                maxWidth: 850,
                            }}
                        >
                            <Button
                                component="a"
                                href={trackingUrl}
                                size="xl"
                                radius="xl"
                                color="smilehaos"
                                fullWidth
                                rightSection={
                                    <IconArrowRight size={21} />
                                }
                                styles={{
                                    root: {
                                        height: 64,
                                    },
                                }}
                            >
                                View appointment status
                            </Button>
                        </motion.div>
                    )}

                    {/* =====================================================
              HOME
          ===================================================== */}

                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        transition={{
                            delay: 0.7,
                            duration: 0.5,
                        }}
                    >
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
                    </motion.div>

                    {/* =====================================================
              FOOTER MESSAGE
          ===================================================== */}

                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        transition={{
                            delay: 0.8,
                            duration: 0.6,
                        }}
                    >
                        <Text
                            ta="center"
                            size="sm"
                            c="dimmed"
                            maw={600}
                            lh={1.6}
                        >
                            We look forward to seeing you and
                            helping you keep that smile healthy. ✨
                        </Text>
                    </motion.div>
                </Stack>
            </Container>
        </main>
    )
}

export default BookingConfirmation
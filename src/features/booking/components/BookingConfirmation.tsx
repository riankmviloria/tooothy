
import {
    Badge,
    Button,
    Card,
    Container,
    Group,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core'

import BookingHeader from './BookingHeader'
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
    onBackHome,
}: BookingConfirmationProps) {
    const trackingUrl =
        trackingToken
            ? `/appointment/${trackingToken}`
            : null

    const formattedDate = selectedDate
        ? new Date(
            `${selectedDate}T00:00:00`,
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

    return (
        <>
            <BookingHeader
                step={4}
                totalSteps={4}
            />

            <main>
                <Container
                    size="sm"
                    py={{
                        base: 'xl',
                        sm: 80,
                    }}
                >
                    <Stack
                        align="center"
                        gap="xl"
                        ta="center"
                    >
                        <ThemeIcon
                            size={80}
                            radius="xl"
                            color="smilehaos"
                            variant="light"
                        >
                            ✓
                        </ThemeIcon>

                        <Stack gap="xs">
                            <Title
                                order={1}
                                size="clamp(2.5rem, 7vw, 4rem)"
                                style={{
                                    letterSpacing: '-0.04em',
                                }}
                            >
                                You're all set!
                            </Title>

                            <Text
                                size="lg"
                                c="dimmed"
                                maw={500}
                            >
                                Your appointment request with SmileHaos Dental Clinic has been successfully submitted.
                            </Text>
                        </Stack>

                        <Card
                            withBorder
                            radius="xl"
                            padding="xl"
                            w="100%"
                        >
                            <Stack gap="lg">
                                <Group justify="space-between">
                                    <Text
                                        fw={700}
                                        size="lg"
                                    >
                                        Appointment details
                                    </Text>

                                    <Badge
                                        color="yellow"
                                        variant="light"
                                    >
                                        Pending
                                    </Badge>
                                </Group>

                                {appointmentNumber && (
                                    <Stack
                                        gap={2}
                                        align="flex-start"
                                    >
                                        <Text
                                            size="xs"
                                            c="dimmed"
                                            tt="uppercase"
                                            fw={700}
                                        >
                                            Appointment reference
                                        </Text>

                                        <Text
                                            fw={800}
                                            size="xl"
                                            style={{
                                                letterSpacing: '0.03em',
                                            }}
                                        >
                                            {appointmentNumber}
                                        </Text>
                                    </Stack>
                                )}

                                <Group>
                                    <ThemeIcon
                                        variant="light"
                                        color="smilehaos"
                                        size={44}
                                        radius="md"
                                    >
                                        {selectedService?.icon}
                                    </ThemeIcon>

                                    <Stack gap={2}>
                                        <Text fw={700}>
                                            {selectedService?.name}
                                        </Text>

                                        <Text
                                            size="sm"
                                            c="dimmed"
                                        >
                                            {selectedService?.duration} minutes
                                        </Text>
                                    </Stack>
                                </Group>

                                <Stack
                                    gap="xs"
                                    ta="left"
                                >
                                    <Text>
                                        📅 {formattedDate}
                                    </Text>

                                    <Text>
                                        ⏰ {selectedTime}
                                    </Text>

                                    <Text>
                                        👤 {fullName}
                                    </Text>
                                </Stack>

                                <Stack gap={4}>
                                    <Group justify="space-between">
                                        <Text c="dimmed">
                                            Price
                                        </Text>

                                        <Text
                                            fw={800}
                                            size="xl"
                                            c="smilehaos.7"
                                            ta="right"
                                        >
                                            {selectedService?.priceLabel ??
                                                'Consultation required'}
                                        </Text>
                                    </Group>

                                    <Text
                                        size="xs"
                                        c="dimmed"
                                        ta="right"
                                    >
                                        Final price may vary depending on the dentist's consultation,
                                        assessment, and treatment requirements.
                                    </Text>
                                </Stack>
                            </Stack>
                        </Card>

                        <Card
                            withBorder
                            radius="xl"
                            padding="lg"
                            w="100%"
                        >
                            <Stack
                                gap="xs"
                                align="center"
                            >
                                <Text fw={700}>
                                    Waiting for clinic confirmation
                                </Text>

                                <Text
                                    size="sm"
                                    c="dimmed"
                                    maw={450}
                                >
                                    Your appointment request has been received.
                                    The clinic will review your request and confirm
                                    your appointment.
                                </Text>
                            </Stack>
                        </Card>

                        {trackingUrl && (
                            <Button
                                component="a"
                                href={trackingUrl}
                                size="lg"
                                fullWidth
                            >
                                View appointment status
                            </Button>
                        )}

                        <Button
                            variant="subtle"
                            size="lg"
                            onClick={onBackHome}
                        >
                            Back to SmileHaos
                        </Button>
                    </Stack>
                </Container>
            </main>
        </>
    )
}

export default BookingConfirmation
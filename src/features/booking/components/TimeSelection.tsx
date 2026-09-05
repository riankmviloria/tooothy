
import {
    Badge,
    Button,
    Card,
    Container,
    Group,
    Loader,
    SimpleGrid,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core'

import BookingHeader from './BookingHeader'

import type {
    TimeSlot,
} from '../types/booking.types'
import type { Service } from '../../services/types/service.types'

type TimeSelectionProps = {
    selectedService: Service | null
    selectedDate: string | null
    selectedTime: string | null
    timeSlots: TimeSlot[]
    bookedTimes: string[]
    isLoadingBookedTimes: boolean
    onTimeChange: (time: string) => void
    onBack: () => void
    onContinue: () => void
}

function TimeSelection({
    selectedService,
    selectedDate,
    selectedTime,
    timeSlots,
    bookedTimes,
    isLoadingBookedTimes,
    onTimeChange,
    onBack,
    onContinue,
}: TimeSelectionProps) {
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
        : 'No date selected'

    return (
        <>
            <BookingHeader
                step={3}
                totalSteps={4}
            />

            <main>
                <Container
                    size="sm"
                    py={{
                        base: 'xl',
                        sm: 60,
                    }}
                >
                    <Stack gap="xl">
                        <Stack gap="xs">
                            <Badge
                                color="smilehaos"
                                variant="light"
                                w="fit-content"
                            >
                                Step 3
                            </Badge>

                            <Title
                                order={1}
                                size="clamp(2.2rem, 6vw, 3.5rem)"
                                style={{
                                    letterSpacing:
                                        '-0.04em',
                                }}
                            >
                                What time works for you?
                            </Title>

                            <Text
                                size="lg"
                                c="dimmed"
                            >
                                Choose an available
                                appointment time.
                            </Text>
                        </Stack>

                        <Card
                            withBorder
                            radius="lg"
                            padding="md"
                        >
                            <Group>
                                <ThemeIcon
                                    variant="light"
                                    color="smilehaos"
                                    size={44}
                                    radius="md"
                                >
                                    🗓️
                                </ThemeIcon>

                                <Stack gap={2}>
                                    <Text fw={700}>
                                        {formattedDate}
                                    </Text>

                                    <Text
                                        size="sm"
                                        c="dimmed"
                                    >
                                        {selectedService?.name}
                                        {' · '}
                                        {
                                            selectedService?.duration
                                        }
                                        {' minutes'}
                                    </Text>
                                </Stack>
                            </Group>
                        </Card>

                        <Stack gap="md">
                            <Group
                                justify="space-between"
                            >
                                <Text
                                    fw={700}
                                    size="lg"
                                >
                                    Available times
                                </Text>

                                {isLoadingBookedTimes && (
                                    <Loader
                                        size="sm"
                                        color="smilehaos"
                                    />
                                )}
                            </Group>

                            <SimpleGrid
                                cols={{
                                    base: 2,
                                    xs: 3,
                                }}
                                spacing="sm"
                            >
                                {timeSlots.map(
                                    (slot) => {
                                        const selected =
                                            selectedTime ===
                                            slot.time

                                        const booked =
                                            bookedTimes.includes(
                                                slot.time,
                                            )

                                        return (
                                            <Button
                                                key={
                                                    slot.time
                                                }
                                                variant={
                                                    selected
                                                        ? 'filled'
                                                        : 'light'
                                                }
                                                color="smilehaos"
                                                size="lg"
                                                h={58}
                                                disabled={
                                                    !slot.available ||
                                                    booked ||
                                                    isLoadingBookedTimes
                                                }
                                                onClick={() =>
                                                    onTimeChange(
                                                        slot.time,
                                                    )
                                                }
                                            >
                                                {booked
                                                    ? 'Booked'
                                                    : slot.time}
                                            </Button>
                                        )
                                    },
                                )}
                            </SimpleGrid>

                            {!isLoadingBookedTimes &&
                                bookedTimes.length >
                                    0 && (
                                    <Text
                                        size="sm"
                                        c="dimmed"
                                        ta="center"
                                    >
                                        Times marked as
                                        Booked are no
                                        longer available.
                                    </Text>
                                )}
                        </Stack>

                        <Group justify="space-between">
                            <Button
                                variant="subtle"
                                size="lg"
                                onClick={onBack}
                            >
                                Back
                            </Button>

                            <Button
                                size="lg"
                                disabled={
                                    !selectedTime ||
                                    isLoadingBookedTimes
                                }
                                onClick={onContinue}
                            >
                                Continue
                            </Button>
                        </Group>
                    </Stack>
                </Container>
            </main>
        </>
    )
}

export default TimeSelection
import {
    Badge,
    Box,
    Button,
    Divider,
    Group,
    Modal,
    Stack,
    Text,
    ThemeIcon,
} from '@mantine/core'

import {
    IconCalendarEvent,
    IconClock,
} from '@tabler/icons-react'

import { motion } from 'motion/react'

import type { AdminAppointment } from '../services/appointmentAdminService'

type CalendarDayAppointmentsModalProps = {
    opened: boolean
    onClose: () => void
    date: Date | null
    appointments: AdminAppointment[]
    onAppointmentClick: (
        appointment: AdminAppointment,
    ) => void
}

const statusConfig: Record<
    string,
    {
        label: string
        color: string
    }
> = {
    pending: {
        label: 'Pending',
        color: 'yellow',
    },

    confirmed: {
        label: 'Confirmed',
        color: 'blue',
    },

    completed: {
        label: 'Completed',
        color: 'green',
    },

    cancelled: {
        label: 'Cancelled',
        color: 'red',
    },

    noShow: {
        label: 'No Show',
        color: 'gray',
    },
}

function formatTime(time: string) {
    const [hours, minutes] = time
        .split(':')
        .map(Number)

    const date = new Date()

    date.setHours(
        hours,
        minutes,
        0,
        0,
    )

    return date.toLocaleTimeString(
        'en-US',
        {
            hour: 'numeric',
            minute: '2-digit',
        },
    )
}

function formatDate(
    date: Date | null,
) {
    if (!date) {
        return ''
    }

    return date.toLocaleDateString(
        'en-US',
        {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        },
    )
}

function getStatusConfig(
    status: string,
) {
    return (
        statusConfig[status] ?? {
            label: status,
            color: 'gray',
        }
    )
}

function getStatusAccent(
    status: string,
) {
    switch (status) {
        case 'confirmed':
            return '#228BE6'

        case 'completed':
            return '#40C057'

        case 'pending':
            return '#FAB005'

        case 'cancelled':
            return '#FA5252'

        case 'noShow':
            return '#868E96'

        default:
            return '#868E96'
    }
}

export default function CalendarDayAppointmentsModal({
    opened,
    onClose,
    date,
    appointments,
    onAppointmentClick,
}: CalendarDayAppointmentsModalProps) {
    const sortedAppointments = [
        ...appointments,
    ].sort((a, b) =>
        a.time.localeCompare(b.time),
    )

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            centered
            size="lg"
            radius="xl"
            title={
                <Group gap="sm">
                    <ThemeIcon
                        size={38}
                        radius="xl"
                        variant="light"
                        color="blue"
                    >
                        <IconCalendarEvent
                            size={20}
                            stroke={1.8}
                        />
                    </ThemeIcon>

                    <Box>
                        <Text
                            fw={800}
                            size="lg"
                            lh={1.1}
                        >
                            Appointments
                        </Text>

                        <Text
                            size="xs"
                            c="dimmed"
                            mt={3}
                        >
                            {formatDate(date)}
                        </Text>
                    </Box>
                </Group>
            }
            overlayProps={{
                backgroundOpacity: 0.45,
                blur: 4,
            }}
        >
            <Stack gap="md">
                {/* SUMMARY */}
                <Box>
                    <Text
                        size="sm"
                        fw={700}
                    >
                        {appointments.length}{' '}
                        {appointments.length === 1
                            ? 'appointment'
                            : 'appointments'}
                    </Text>

                    <Text
                        size="xs"
                        c="dimmed"
                        mt={3}
                    >
                        Select an appointment to
                        view its details.
                    </Text>
                </Box>

                <Divider />

                {/* APPOINTMENTS */}
                {sortedAppointments.length ===
                0 ? (
                    <Box
                        py="xl"
                        ta="center"
                    >
                        <ThemeIcon
                            size={52}
                            radius="xl"
                            variant="light"
                            color="gray"
                            mx="auto"
                        >
                            <IconCalendarEvent
                                size={25}
                                stroke={1.7}
                            />
                        </ThemeIcon>

                        <Text
                            fw={700}
                            mt="md"
                        >
                            No appointments
                        </Text>

                        <Text
                            size="sm"
                            c="dimmed"
                            mt={4}
                        >
                            There are no
                            appointments scheduled
                            for this day.
                        </Text>
                    </Box>
                ) : (
                    <Box
                        style={{
                            maxHeight: 500,
                            overflowY: 'auto',
                            paddingRight: 6,
                        }}
                    >
                        <Stack gap="sm">
                            {sortedAppointments.map(
                                (
                                    appointment,
                                    index,
                                ) => {
                                    const status =
                                        getStatusConfig(
                                            appointment.status,
                                        )

                                    const accent =
                                        getStatusAccent(
                                            appointment.status,
                                        )

                                    return (
                                        <motion.div
                                            key={
                                                appointment.id
                                            }
                                            initial={{
                                                opacity: 0,
                                                y: 8,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            transition={{
                                                duration: 0.2,
                                                delay:
                                                    index *
                                                    0.03,
                                            }}
                                        >
                                            <Box
                                                onClick={() =>
                                                    onAppointmentClick(
                                                        appointment,
                                                    )
                                                }
                                                p="md"
                                                style={{
                                                    cursor: 'pointer',
                                                    border:
                                                        '1px solid #E9E5DF',
                                                    borderLeft:
                                                        `4px solid ${accent}`,
                                                    borderRadius: 14,
                                                    background:
                                                        '#FFFFFF',
                                                    transition:
                                                        'all 160ms ease',
                                                }}
                                                onMouseEnter={(
                                                    event,
                                                ) => {
                                                    event.currentTarget.style.transform =
                                                        'translateY(-1px)'

                                                    event.currentTarget.style.boxShadow =
                                                        '0 8px 24px rgba(0, 0, 0, 0.06)'
                                                }}
                                                onMouseLeave={(
                                                    event,
                                                ) => {
                                                    event.currentTarget.style.transform =
                                                        'translateY(0)'

                                                    event.currentTarget.style.boxShadow =
                                                        'none'
                                                }}
                                            >
                                                {/* TOP ROW */}
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
                                                            size={
                                                                42
                                                            }
                                                            radius="xl"
                                                            variant="light"
                                                            color={
                                                                status.color
                                                            }
                                                        >
                                                            <IconCalendarEvent
                                                                size={
                                                                    19
                                                                }
                                                                stroke={
                                                                    1.8
                                                                }
                                                            />
                                                        </ThemeIcon>

                                                        <Box
                                                            style={{
                                                                minWidth: 0,
                                                            }}
                                                        >
                                                            <Text
                                                                fw={
                                                                    750
                                                                }
                                                                size="sm"
                                                                truncate
                                                            >
                                                                {
                                                                    appointment
                                                                        .patient
                                                                        .fullName
                                                                }
                                                            </Text>

                                                            <Text
                                                                size="xs"
                                                                c="dimmed"
                                                                mt={
                                                                    3
                                                                }
                                                                truncate
                                                            >
                                                                {
                                                                    appointment.serviceName
                                                                }
                                                            </Text>
                                                        </Box>
                                                    </Group>

                                                    <Badge
                                                        size="sm"
                                                        variant="light"
                                                        color={
                                                            status.color
                                                        }
                                                        radius="sm"
                                                    >
                                                        {
                                                            status.label
                                                        }
                                                    </Badge>
                                                </Group>

                                                {/* DETAILS */}
                                                <Group
                                                    gap="xs"
                                                    mt="sm"
                                                >
                                                    <IconClock
                                                        size={
                                                            15
                                                        }
                                                        stroke={
                                                            1.8
                                                        }
                                                    />

                                                    <Text
                                                        size="xs"
                                                        fw={
                                                            600
                                                        }
                                                        c="dimmed"
                                                    >
                                                        {formatTime(
                                                            appointment.time,
                                                        )}
                                                    </Text>

                                                    <Text
                                                        size="xs"
                                                        c="dimmed"
                                                    >
                                                        •
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
                                                </Group>
                                            </Box>
                                        </motion.div>
                                    )
                                },
                            )}
                        </Stack>
                    </Box>
                )}

                {/* FOOTER */}
                <Group
                    justify="flex-end"
                    pt="xs"
                >
                    <Button
                        variant="light"
                        color="gray"
                        radius="md"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )
}
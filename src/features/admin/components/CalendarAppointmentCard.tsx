import {
    Badge,
    Box,
    Group,
    Stack,
    Text,
} from '@mantine/core'

import {
    IconCalendarEvent,
    IconClock,
} from '@tabler/icons-react'

import { motion } from 'motion/react'

import type { AdminAppointment } from '../services/appointmentAdminService'

type CalendarDayAppointmentCardProps = {
    appointment: AdminAppointment
    onClick: () => void
    compact?: boolean
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
}

function formatTime(time: string) {
    if (!time || typeof time !== 'string') {
        return 'Time unavailable'
    }

    const parts = time.trim().split(':')

    if (parts.length < 2) {
        return time
    }

    const hours = Number(parts[0])
    const minutes = Number(parts[1])

    if (
        !Number.isInteger(hours) ||
        !Number.isInteger(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
    ) {
        return time
    }

    const date = new Date()

    date.setHours(
        hours,
        minutes,
        0,
        0,
    )

    if (Number.isNaN(date.getTime())) {
        return time
    }

    return date.toLocaleTimeString(
        'en-US',
        {
            hour: 'numeric',
            minute: '2-digit',
        },
    )
}

function getStatusConfig(
    status: string,
) {
    return (
        statusConfig[status] ?? {
            label: status || 'Unknown',
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

        default:
            return '#868E96'
    }
}

function getPatientName(
    appointment: AdminAppointment,
) {
    const name =
        appointment.patient?.fullName?.trim()

    return name || 'Unknown patient'
}

function getServiceName(
    appointment: AdminAppointment,
) {
    return (
        appointment.serviceName?.trim() ||
        'Dental service'
    )
}

export default function CalendarDayAppointmentCard({
    appointment,
    onClick,
    compact = false,
}: CalendarDayAppointmentCardProps) {
    const status =
        getStatusConfig(
            appointment.status,
        )

    const accent =
        getStatusAccent(
            appointment.status,
        )

    const patientName =
        getPatientName(
            appointment,
        )

    const serviceName =
        getServiceName(
            appointment,
        )

    const formattedTime =
        formatTime(
            appointment.time,
        )

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 4,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            whileHover={{
                y: -1,
                scale: 1.01,
            }}
            transition={{
                duration: 0.16,
            }}
        >
            <Box
                onClick={onClick}
                p={
                    compact
                        ? 'xs'
                        : 'sm'
                }
                style={{
                    cursor: 'pointer',
                    border:
                        '1px solid #E9E5DF',
                    borderLeft:
                        `3px solid ${accent}`,
                    borderRadius:
                        compact
                            ? 8
                            : 12,
                    background:
                        '#FFFFFF',
                    overflow:
                        'hidden',
                    transition:
                        'box-shadow 160ms ease, border-color 160ms ease',
                }}
            >
                {compact ? (
                    <Stack gap={3}>
                        <Text
                            size="xs"
                            fw={700}
                            truncate
                        >
                            {patientName}
                        </Text>

                        <Text
                            size="xs"
                            c="dimmed"
                            truncate
                        >
                            {formattedTime}
                        </Text>
                    </Stack>
                ) : (
                    <Stack gap="xs">
                        <Group
                            justify="space-between"
                            align="flex-start"
                            wrap="nowrap"
                        >
                            <Group
                                gap={6}
                                wrap="nowrap"
                                style={{
                                    minWidth: 0,
                                }}
                            >
                                <IconCalendarEvent
                                    size={15}
                                    stroke={1.8}
                                />

                                <Text
                                    size="sm"
                                    fw={700}
                                    truncate
                                >
                                    {patientName}
                                </Text>
                            </Group>

                            <Badge
                                size="xs"
                                variant="light"
                                color={
                                    status.color
                                }
                                radius="sm"
                                style={{
                                    flexShrink: 0,
                                }}
                            >
                                {
                                    status.label
                                }
                            </Badge>
                        </Group>

                        <Group
                            gap="xs"
                            wrap="wrap"
                        >
                            <Group
                                gap={4}
                                wrap="nowrap"
                            >
                                <IconClock
                                    size={14}
                                    stroke={1.8}
                                />

                                <Text
                                    size="xs"
                                    c="dimmed"
                                >
                                    {formattedTime}
                                </Text>
                            </Group>

                            <Text
                                size="xs"
                                c="dimmed"
                                truncate
                            >
                                • {serviceName}
                            </Text>
                        </Group>
                    </Stack>
                )}
            </Box>
        </motion.div>
    )
}
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
import { motion, useReducedMotion } from 'motion/react'

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
    const shouldReduceMotion =
        useReducedMotion()

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

    const appointmentLabel =
        `${patientName}, ${serviceName}, ${formattedTime}, ${status.label}`

    return (
        <motion.div
            initial={
                shouldReduceMotion
                    ? false
                    : {
                          opacity: 0,
                          y: 4,
                      }
            }
            animate={
                shouldReduceMotion
                    ? undefined
                    : {
                          opacity: 1,
                          y: 0,
                      }
            }
            whileHover={
                shouldReduceMotion
                    ? undefined
                    : {
                          y: -1,
                          scale: 1.01,
                      }
            }
            transition={{
                duration: 0.16,
            }}
            style={{
                width: '100%',
            }}
        >
            <Box
                component="button"
                type="button"
                onClick={onClick}
                p={
                    compact
                        ? 'xs'
                        : 'sm'
                }
                aria-label={`View appointment: ${appointmentLabel}`}
                style={{
                    display: 'block',
                    width: '100%',
                    minWidth: 0,
                    minHeight: compact
                        ? 48
                        : 56,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily:
                        'inherit',
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
                        'box-shadow 160ms ease, border-color 160ms ease, background-color 160ms ease',
                    WebkitTapHighlightColor:
                        'transparent',
                }}
            >
                {compact ? (
                    <Stack
                        gap={3}
                        style={{
                            minWidth: 0,
                        }}
                    >
                        <Text
                            size="xs"
                            fw={700}
                            truncate
                            style={{
                                minWidth: 0,
                            }}
                        >
                            {patientName}
                        </Text>

                        <Group
                            gap={4}
                            wrap="nowrap"
                            style={{
                                minWidth: 0,
                            }}
                        >
                            <IconClock
                                size={12}
                                stroke={1.8}
                                style={{
                                    flexShrink: 0,
                                }}
                            />

                            <Text
                                size="xs"
                                c="dimmed"
                                truncate
                                style={{
                                    minWidth: 0,
                                }}
                            >
                                {formattedTime}
                            </Text>
                        </Group>
                    </Stack>
                ) : (
                    <Stack
                        gap="xs"
                        style={{
                            minWidth: 0,
                        }}
                    >
                        <Group
                            justify="space-between"
                            align="flex-start"
                            wrap="nowrap"
                            gap="xs"
                        >
                            <Group
                                gap={6}
                                wrap="nowrap"
                                style={{
                                    minWidth: 0,
                                    flex: 1,
                                }}
                            >
                                <IconCalendarEvent
                                    size={15}
                                    stroke={1.8}
                                    style={{
                                        flexShrink: 0,
                                    }}
                                />

                                <Text
                                    size="sm"
                                    fw={700}
                                    truncate
                                    style={{
                                        minWidth: 0,
                                    }}
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
                            style={{
                                minWidth: 0,
                            }}
                        >
                            <Group
                                gap={4}
                                wrap="nowrap"
                                style={{
                                    flexShrink: 0,
                                }}
                            >
                                <IconClock
                                    size={14}
                                    stroke={1.8}
                                    style={{
                                        flexShrink: 0,
                                    }}
                                />

                                <Text
                                    size="xs"
                                    c="dimmed"
                                >
                                    {
                                        formattedTime
                                    }
                                </Text>
                            </Group>

                            <Text
                                size="xs"
                                c="dimmed"
                                truncate
                                style={{
                                    minWidth: 0,
                                    flex: 1,
                                }}
                            >
                                •{' '}
                                {
                                    serviceName
                                }
                            </Text>
                        </Group>
                    </Stack>
                )}
            </Box>
        </motion.div>
    )
}
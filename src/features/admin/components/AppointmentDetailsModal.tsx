import {
    Badge,
    Button,
    Card,
    Divider,
    Grid,
    Group,
    Modal,
    ScrollArea,
    Stack,
    Text,
} from '@mantine/core'
import {
    IconCalendar,
    IconCheck,
    IconClock,
    IconMail,
    IconPhone,
    IconUser,
    IconX,
} from '@tabler/icons-react'
import { motion } from 'motion/react'

import type {
    AdminAppointment,
    AppointmentStatus,
} from '../services/appointmentAdminService'

type AppointmentDetailsModalProps = {
    appointment: AdminAppointment | null
    opened: boolean
    onClose: () => void
    onStatusChange: (
        appointmentId: string,
        status: AppointmentStatus,
    ) => Promise<void>
    updatingId: string | null
}

function isValidDate(date: Date) {
    return (
        date instanceof Date &&
        !Number.isNaN(date.getTime())
    )
}

function parseDateString(
    value: string,
): Date | null {
    const match =
        /^(\d{4})-(\d{2})-(\d{2})$/.exec(
            value.trim(),
        )

    if (!match) {
        return null
    }

    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])

    const date = new Date(
        year,
        month - 1,
        day,
    )

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null
    }

    return date
}

function formatDate(
    date: string,
) {
    const value = parseDateString(date)

    if (!value || !isValidDate(value)) {
        return 'Date unavailable'
    }

    return value.toLocaleDateString(
        'en-US',
        {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        },
    )
}

function formatPrice(
    price: number,
) {
    return `₱${price.toLocaleString()}`
}

function getStatusColor(
    status: AppointmentStatus,
) {
    switch (status) {
        case 'confirmed':
            return 'green'

        case 'completed':
            return 'teal'

        case 'cancelled':
            return 'red'

        case 'pending':
        default:
            return 'yellow'
    }
}

function getStatusLabel(
    status: AppointmentStatus,
) {
    switch (status) {
        case 'pending':
            return 'Pending'

        case 'confirmed':
            return 'Confirmed'

        case 'completed':
            return 'Completed'

        case 'cancelled':
            return 'Cancelled'

        default:
            return 'Unknown'
    }
}

function AppointmentDetailsModal({
    appointment,
    opened,
    onClose,
    onStatusChange,
    updatingId,
}: AppointmentDetailsModalProps) {
    if (!appointment) {
        return null
    }

    const isUpdating =
        updatingId === appointment.id

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            centered
            size="xl"
            radius="xl"
            padding={0}
            withCloseButton
            title={null}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 4,
            }}
            styles={{
                content: {
                    maxHeight:
                        'calc(100dvh - 24px)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                },

                header: {
                    display: 'none',
                },

                body: {
                    padding: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0,
                },
            }}
        >
            <Stack
                gap={0}
                style={{
                    minHeight: 0,
                    flex: 1,
                }}
            >

                {/* ================================================== */}
                {/* HEADER */}
                {/* ================================================== */}

                <Stack
                    gap="xs"
                    px="xl"
                    pt="xl"
                    pb="lg"
                    style={{
                        flexShrink: 0,
                    }}
                >
                    <Group
                        justify="space-between"
                        align="flex-start"
                        gap="md"
                        wrap="nowrap"
                    >
                        <Stack
                            gap={4}
                            style={{
                                minWidth: 0,
                                flex: 1,
                            }}
                        >
                            <Text
                                size="xs"
                                fw={800}
                                c="dimmed"
                                tt="uppercase"
                                style={{
                                    letterSpacing:
                                        '0.08em',
                                }}
                            >
                                Appointment details
                            </Text>

                            <Text
                                size="xl"
                                fw={800}
                                style={{
                                    letterSpacing:
                                        '-0.02em',
                                    wordBreak:
                                        'break-word',
                                }}
                            >
                                {
                                    appointment.serviceName
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
                                Appointment for{' '}
                                {
                                    appointment
                                        .patient
                                        .fullName
                                }
                            </Text>
                        </Stack>

                        <Badge
                            size="lg"
                            radius="xl"
                            color={getStatusColor(
                                appointment.status,
                            )}
                            variant="light"
                            style={{
                                flexShrink: 0,
                            }}
                        >
                            {getStatusLabel(
                                appointment.status,
                            )}
                        </Badge>
                    </Group>
                </Stack>

                <Divider />

                {/* ================================================== */}
                {/* SCROLLABLE CONTENT */}
                {/* ================================================== */}

                <ScrollArea
                    type="auto"
                    offsetScrollbars
                    scrollbarSize={6}
                    style={{
                        flex: 1,
                        minHeight: 0,
                    }}
                >
                    <Stack gap={0}>

                        {/* ========================================== */}
                        {/* APPOINTMENT SUMMARY */}
                        {/* ========================================== */}

                        <Stack
                            gap="lg"
                            px="xl"
                            py="xl"
                        >
                            <Text
                                size="xs"
                                fw={800}
                                c="dimmed"
                                tt="uppercase"
                                style={{
                                    letterSpacing:
                                        '0.08em',
                                }}
                            >
                                Appointment
                            </Text>

                            <Grid gap="md">

                                {/* DATE */}

                                <Grid.Col
                                    span={{
                                        base: 12,
                                        sm: 6,
                                    }}
                                >
                                    <Card
                                        withBorder
                                        radius="lg"
                                        padding="md"
                                        style={{
                                            height:
                                                '100%',
                                        }}
                                    >
                                        <Group
                                            gap="sm"
                                            align="flex-start"
                                            wrap="nowrap"
                                        >
                                            <IconCalendar
                                                size={20}
                                                stroke={1.8}
                                                style={{
                                                    flexShrink:
                                                        0,
                                                }}
                                            />

                                            <Stack
                                                gap={3}
                                                style={{
                                                    minWidth:
                                                        0,
                                                }}
                                            >
                                                <Text
                                                    size="xs"
                                                    c="dimmed"
                                                    fw={600}
                                                >
                                                    Date
                                                </Text>

                                                <Text
                                                    size="sm"
                                                    fw={700}
                                                    style={{
                                                        wordBreak:
                                                            'break-word',
                                                    }}
                                                >
                                                    {formatDate(
                                                        appointment.date,
                                                    )}
                                                </Text>
                                            </Stack>
                                        </Group>
                                    </Card>
                                </Grid.Col>

                                {/* TIME */}

                                <Grid.Col
                                    span={{
                                        base: 12,
                                        sm: 6,
                                    }}
                                >
                                    <Card
                                        withBorder
                                        radius="lg"
                                        padding="md"
                                        style={{
                                            height:
                                                '100%',
                                        }}
                                    >
                                        <Group
                                            gap="sm"
                                            align="flex-start"
                                            wrap="nowrap"
                                        >
                                            <IconClock
                                                size={20}
                                                stroke={1.8}
                                                style={{
                                                    flexShrink:
                                                        0,
                                                }}
                                            />

                                            <Stack
                                                gap={3}
                                                style={{
                                                    minWidth:
                                                        0,
                                                }}
                                            >
                                                <Text
                                                    size="xs"
                                                    c="dimmed"
                                                    fw={600}
                                                >
                                                    Time
                                                </Text>

                                                <Text
                                                    size="sm"
                                                    fw={700}
                                                >
                                                    {
                                                        appointment.time
                                                    }
                                                </Text>
                                            </Stack>
                                        </Group>
                                    </Card>
                                </Grid.Col>

                                {/* SERVICE */}

                                <Grid.Col
                                    span={{
                                        base: 12,
                                        sm: 8,
                                    }}
                                >
                                    <Card
                                        withBorder
                                        radius="lg"
                                        padding="md"
                                        style={{
                                            height:
                                                '100%',
                                        }}
                                    >
                                        <Stack gap={3}>
                                            <Text
                                                size="xs"
                                                c="dimmed"
                                                fw={600}
                                            >
                                                Service
                                            </Text>

                                            <Text
                                                fw={700}
                                                size="sm"
                                                style={{
                                                    wordBreak:
                                                        'break-word',
                                                }}
                                            >
                                                {
                                                    appointment.serviceName
                                                }
                                            </Text>

                                            <Text
                                                size="xs"
                                                c="dimmed"
                                            >
                                                {
                                                    appointment.duration
                                                }{' '}
                                                minutes
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>

                                {/* PRICE */}

                                <Grid.Col
                                    span={{
                                        base: 12,
                                        sm: 4,
                                    }}
                                >
                                    <Card
                                        withBorder
                                        radius="lg"
                                        padding="md"
                                        style={{
                                            height:
                                                '100%',
                                        }}
                                    >
                                        <Stack gap={3}>
                                            <Text
                                                size="xs"
                                                c="dimmed"
                                                fw={600}
                                            >
                                                Total
                                            </Text>

                                            <Text
                                                fw={800}
                                                size="lg"
                                            >
                                                {formatPrice(
                                                    appointment.price,
                                                )}
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>

                            </Grid>
                        </Stack>

                        <Divider />

                        {/* ========================================== */}
                        {/* PATIENT */}
                        {/* ========================================== */}

                        <Stack
                            gap="lg"
                            px="xl"
                            py="xl"
                        >
                            <Text
                                size="xs"
                                fw={800}
                                c="dimmed"
                                tt="uppercase"
                                style={{
                                    letterSpacing:
                                        '0.08em',
                                }}
                            >
                                Patient information
                            </Text>

                            <Grid gap="md">

                                {/* NAME */}

                                <Grid.Col span={12}>
                                    <Card
                                        withBorder
                                        radius="lg"
                                        padding="md"
                                    >
                                        <Group
                                            gap="sm"
                                            align="flex-start"
                                            wrap="nowrap"
                                        >
                                            <IconUser
                                                size={20}
                                                stroke={1.8}
                                                style={{
                                                    flexShrink:
                                                        0,
                                                }}
                                            />

                                            <Stack
                                                gap={3}
                                                style={{
                                                    minWidth:
                                                        0,
                                                }}
                                            >
                                                <Text
                                                    size="xs"
                                                    c="dimmed"
                                                    fw={600}
                                                >
                                                    Full name
                                                </Text>

                                                <Text
                                                    fw={700}
                                                    size="sm"
                                                    style={{
                                                        wordBreak:
                                                            'break-word',
                                                    }}
                                                >
                                                    {
                                                        appointment
                                                            .patient
                                                            .fullName
                                                    }
                                                </Text>
                                            </Stack>
                                        </Group>
                                    </Card>
                                </Grid.Col>

                                {/* PHONE */}

                                <Grid.Col
                                    span={{
                                        base: 12,
                                        sm: 6,
                                    }}
                                >
                                    <Card
                                        withBorder
                                        radius="lg"
                                        padding="md"
                                        style={{
                                            height:
                                                '100%',
                                        }}
                                    >
                                        <Group
                                            gap="sm"
                                            align="flex-start"
                                            wrap="nowrap"
                                        >
                                            <IconPhone
                                                size={20}
                                                stroke={1.8}
                                                style={{
                                                    flexShrink:
                                                        0,
                                                }}
                                            />

                                            <Stack
                                                gap={3}
                                                style={{
                                                    minWidth:
                                                        0,
                                                }}
                                            >
                                                <Text
                                                    size="xs"
                                                    c="dimmed"
                                                    fw={600}
                                                >
                                                    Phone
                                                </Text>

                                                <Text
                                                    fw={700}
                                                    size="sm"
                                                    style={{
                                                        wordBreak:
                                                            'break-word',
                                                    }}
                                                >
                                                    {
                                                        appointment
                                                            .patient
                                                            .phone
                                                    }
                                                </Text>
                                            </Stack>
                                        </Group>
                                    </Card>
                                </Grid.Col>

                                {/* EMAIL */}

                                <Grid.Col
                                    span={{
                                        base: 12,
                                        sm: 6,
                                    }}
                                >
                                    <Card
                                        withBorder
                                        radius="lg"
                                        padding="md"
                                        style={{
                                            height:
                                                '100%',
                                        }}
                                    >
                                        <Group
                                            gap="sm"
                                            align="flex-start"
                                            wrap="nowrap"
                                        >
                                            <IconMail
                                                size={20}
                                                stroke={1.8}
                                                style={{
                                                    flexShrink:
                                                        0,
                                                }}
                                            />

                                            <Stack
                                                gap={3}
                                                style={{
                                                    minWidth:
                                                        0,
                                                    flex: 1,
                                                }}
                                            >
                                                <Text
                                                    size="xs"
                                                    c="dimmed"
                                                    fw={600}
                                                >
                                                    Email
                                                </Text>

                                                <Text
                                                    fw={700}
                                                    size="sm"
                                                    style={{
                                                        overflowWrap:
                                                            'anywhere',
                                                    }}
                                                >
                                                    {
                                                        appointment
                                                            .patient
                                                            .email
                                                    }
                                                </Text>
                                            </Stack>
                                        </Group>
                                    </Card>
                                </Grid.Col>

                            </Grid>
                        </Stack>

                        <Divider />

                        {/* ========================================== */}
                        {/* NOTES */}
                        {/* ========================================== */}

                        <Stack
                            gap="md"
                            px="xl"
                            py="xl"
                        >
                            <Text
                                size="xs"
                                fw={800}
                                c="dimmed"
                                tt="uppercase"
                                style={{
                                    letterSpacing:
                                        '0.08em',
                                }}
                            >
                                Patient notes
                            </Text>

                            <Card
                                withBorder
                                radius="lg"
                                padding="lg"
                                bg="smilehaos.0"
                            >
                                <Text
                                    size="sm"
                                    c={
                                        appointment
                                            .patient
                                            .notes
                                            ? undefined
                                            : 'dimmed'
                                    }
                                    style={{
                                        lineHeight: 1.7,
                                        overflowWrap:
                                            'anywhere',
                                    }}
                                >
                                    {appointment
                                        .patient
                                        .notes ||
                                        'No notes provided.'}
                                </Text>
                            </Card>
                        </Stack>

                        <Divider />

                        {/* ========================================== */}
                        {/* MANAGEMENT */}
                        {/* ========================================== */}

                        <Stack
                            gap="lg"
                            px="xl"
                            py="xl"
                        >
                            <Group
                                justify="space-between"
                                align="center"
                                gap="md"
                                wrap="nowrap"
                            >
                                <Stack
                                    gap={2}
                                    style={{
                                        minWidth: 0,
                                    }}
                                >
                                    <Text
                                        size="sm"
                                        fw={700}
                                    >
                                        Appointment status
                                    </Text>

                                    <Text
                                        size="xs"
                                        c="dimmed"
                                    >
                                        Update the
                                        appointment status
                                        below.
                                    </Text>
                                </Stack>

                                <Badge
                                    size="lg"
                                    radius="xl"
                                    color={getStatusColor(
                                        appointment.status,
                                    )}
                                    variant="light"
                                    style={{
                                        flexShrink: 0,
                                    }}
                                >
                                    {getStatusLabel(
                                        appointment.status,
                                    )}
                                </Badge>
                            </Group>

                            {/* ACTIONS */}

                            <Stack gap="sm">

                                {appointment.status ===
                                    'pending' && (
                                    <>
                                        <motion.div
                                            whileHover={{
                                                y: -1,
                                            }}
                                            whileTap={{
                                                scale: 0.99,
                                            }}
                                        >
                                            <Button
                                                fullWidth
                                                size="md"
                                                color="green"
                                                radius="lg"
                                                leftSection={
                                                    <IconCheck
                                                        size={
                                                            18
                                                        }
                                                    />
                                                }
                                                loading={
                                                    isUpdating
                                                }
                                                onClick={() =>
                                                    onStatusChange(
                                                        appointment.id,
                                                        'confirmed',
                                                    )
                                                }
                                            >
                                                Confirm Appointment
                                            </Button>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{
                                                y: -1,
                                            }}
                                            whileTap={{
                                                scale: 0.99,
                                            }}
                                        >
                                            <Button
                                                fullWidth
                                                size="md"
                                                color="red"
                                                variant="light"
                                                radius="lg"
                                                leftSection={
                                                    <IconX
                                                        size={
                                                            18
                                                        }
                                                    />
                                                }
                                                loading={
                                                    isUpdating
                                                }
                                                onClick={() =>
                                                    onStatusChange(
                                                        appointment.id,
                                                        'cancelled',
                                                    )
                                                }
                                            >
                                                Cancel Appointment
                                            </Button>
                                        </motion.div>
                                    </>
                                )}

                                {appointment.status ===
                                    'confirmed' && (
                                    <>
                                        <motion.div
                                            whileHover={{
                                                y: -1,
                                            }}
                                            whileTap={{
                                                scale: 0.99,
                                            }}
                                        >
                                            <Button
                                                fullWidth
                                                size="md"
                                                color="teal"
                                                radius="lg"
                                                leftSection={
                                                    <IconCheck
                                                        size={
                                                            18
                                                        }
                                                    />
                                                }
                                                loading={
                                                    isUpdating
                                                }
                                                onClick={() =>
                                                    onStatusChange(
                                                        appointment.id,
                                                        'completed',
                                                    )
                                                }
                                            >
                                                Mark as Completed
                                            </Button>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{
                                                y: -1,
                                            }}
                                            whileTap={{
                                                scale: 0.99,
                                            }}
                                        >
                                            <Button
                                                fullWidth
                                                size="md"
                                                color="red"
                                                variant="light"
                                                radius="lg"
                                                leftSection={
                                                    <IconX
                                                        size={
                                                            18
                                                        }
                                                    />
                                                }
                                                loading={
                                                    isUpdating
                                                }
                                                onClick={() =>
                                                    onStatusChange(
                                                        appointment.id,
                                                        'cancelled',
                                                    )
                                                }
                                            >
                                                Cancel Appointment
                                            </Button>
                                        </motion.div>
                                    </>
                                )}

                                {appointment.status ===
                                    'cancelled' && (
                                    <motion.div
                                        whileHover={{
                                            y: -1,
                                        }}
                                        whileTap={{
                                            scale: 0.99,
                                        }}
                                    >
                                        <Button
                                            fullWidth
                                            size="md"
                                            variant="light"
                                            radius="lg"
                                            loading={
                                                isUpdating
                                            }
                                            onClick={() =>
                                                onStatusChange(
                                                    appointment.id,
                                                    'pending',
                                                )
                                            }
                                        >
                                            Reopen Appointment
                                        </Button>
                                    </motion.div>
                                )}

                                {appointment.status ===
                                    'completed' && (
                                    <Card
                                        withBorder
                                        radius="lg"
                                        padding="md"
                                        bg="gray.0"
                                    >
                                        <Text
                                            size="sm"
                                            c="dimmed"
                                            ta="center"
                                        >
                                            This appointment
                                            has been
                                            completed.
                                        </Text>
                                    </Card>
                                )}

                            </Stack>
                        </Stack>

                    </Stack>
                </ScrollArea>

                {/* ================================================== */}
                {/* FOOTER */}
                {/* ================================================== */}

                <Divider />

                <Group
                    justify="flex-end"
                    px="xl"
                    py="lg"
                    style={{
                        flexShrink: 0,
                    }}
                >
                    <Button
                        variant="subtle"
                        color="gray"
                        radius="lg"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </Group>

            </Stack>
        </Modal>
    )
}

export default AppointmentDetailsModal
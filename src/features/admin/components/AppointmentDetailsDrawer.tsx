import {
    Badge,
    Button,
    Card,
    Divider,
    Drawer,
    Grid,
    Group,
    Stack,
    Text,
} from '@mantine/core'

import type {
    AdminAppointment,
    AppointmentStatus,
} from '../services/appointmentAdminService'

type AppointmentDetailsDrawerProps = {
    appointment: AdminAppointment | null
    opened: boolean
    onClose: () => void
    onStatusChange: (
        appointmentId: string,
        status: AppointmentStatus,
    ) => Promise<void>
    updatingId: string | null
}

function AppointmentDetailsDrawer({
    appointment,
    opened,
    onClose,
    onStatusChange,
    updatingId,
}: AppointmentDetailsDrawerProps) {
    if (!appointment) {
        return null
    }

    const isUpdating =
        updatingId ===
        appointment.id

    const getStatusColor =
        (
            status: AppointmentStatus,
        ) => {
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

    const getStatusLabel =
        (
            status: AppointmentStatus,
        ) => {
            switch (status) {
                case 'pending':
                    return 'Pending'

                case 'confirmed':
                    return 'Confirmed'

                case 'completed':
                    return 'Completed'

                case 'cancelled':
                    return 'Cancelled'
            }
        }

    const formatDate =
        (date: string) => {
            const value =
                new Date(
                    `${date}T00:00:00`,
                )

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

    const formatPrice =
        (price: number) => {
            return `₱${price.toLocaleString()}`
        }

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            position="right"
            size="480px"
            styles={{
                content: {
                    maxWidth: '100%',
                },
            }}
            title={
                <Text
                    fw={700}
                    size="lg"
                >
                    Appointment Details
                </Text>
            }
        >
            <Stack gap="xl">

                {/* SERVICE */}

                <Stack gap="xs">
                    <Text
                        size="xs"
                        fw={700}
                        c="dimmed"
                        tt="uppercase"
                    >
                        Service
                    </Text>

                    <Group
                        justify="space-between"
                        align="flex-start"
                        wrap="nowrap"
                    >
                        <Stack
                            gap={2}
                            style={{
                                minWidth: 0,
                            }}
                        >
                            <Text
                                fw={700}
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

                        <Text
                            fw={800}
                            size="xl"
                            style={{
                                flexShrink: 0,
                            }}
                        >
                            {formatPrice(
                                appointment.price,
                            )}
                        </Text>
                    </Group>
                </Stack>

                <Divider />

                {/* APPOINTMENT */}

                <Stack gap="md">
                    <Text
                        size="xs"
                        fw={700}
                        c="dimmed"
                        tt="uppercase"
                    >
                        Appointment
                    </Text>

                    <Grid>
                        <Grid.Col span={6}>
                            <Stack gap={2}>
                                <Text
                                    size="xs"
                                    c="dimmed"
                                >
                                    Date
                                </Text>

                                <Text fw={600}>
                                    {formatDate(
                                        appointment.date,
                                    )}
                                </Text>
                            </Stack>
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <Stack gap={2}>
                                <Text
                                    size="xs"
                                    c="dimmed"
                                >
                                    Time
                                </Text>

                                <Text fw={600}>
                                    {
                                        appointment.time
                                    }
                                </Text>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </Stack>

                <Divider />

                {/* PATIENT */}

                <Stack gap="md">
                    <Text
                        size="xs"
                        fw={700}
                        c="dimmed"
                        tt="uppercase"
                    >
                        Patient
                    </Text>

                    <Stack gap="md">
                        <Stack gap={2}>
                            <Text
                                size="xs"
                                c="dimmed"
                            >
                                Full name
                            </Text>

                            <Text fw={600}>
                                {
                                    appointment
                                        .patient
                                        .fullName
                                }
                            </Text>
                        </Stack>

                        <Stack gap={2}>
                            <Text
                                size="xs"
                                c="dimmed"
                            >
                                Phone
                            </Text>

                            <Text fw={600}>
                                {
                                    appointment
                                        .patient
                                        .phone
                                }
                            </Text>
                        </Stack>

                        <Stack gap={2}>
                            <Text
                                size="xs"
                                c="dimmed"
                            >
                                Email
                            </Text>

                            <Text
                                fw={600}
                                style={{
                                    wordBreak:
                                        'break-word',
                                }}
                            >
                                {
                                    appointment
                                        .patient
                                        .email
                                }
                            </Text>
                        </Stack>
                    </Stack>
                </Stack>

                <Divider />

                {/* NOTES */}

                <Stack gap="md">
                    <Text
                        size="xs"
                        fw={700}
                        c="dimmed"
                        tt="uppercase"
                    >
                        Notes
                    </Text>

                    <Card
                        withBorder
                        radius="lg"
                        padding="md"
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
                        >
                            {appointment
                                .patient
                                .notes ||
                                'No notes provided.'}
                        </Text>
                    </Card>
                </Stack>

                <Divider />

                {/* STATUS */}

                <Stack gap="md">
                    <Group
                        justify="space-between"
                        align="center"
                    >
                        <Text
                            size="xs"
                            fw={700}
                            c="dimmed"
                            tt="uppercase"
                        >
                            Status
                        </Text>

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
                    </Group>

                    {/* ACTIONS */}

                    <Stack gap="sm">

                        {appointment.status ===
                            'pending' && (
                            <>
                                <Button
                                    fullWidth
                                    size="md"
                                    color="green"
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

                                <Button
                                    fullWidth
                                    size="md"
                                    color="red"
                                    variant="light"
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
                            </>
                        )}

                        {appointment.status ===
                            'confirmed' && (
                            <>
                                <Button
                                    fullWidth
                                    size="md"
                                    color="teal"
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

                                <Button
                                    fullWidth
                                    size="md"
                                    color="red"
                                    variant="light"
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
                            </>
                        )}

                        {appointment.status ===
                            'cancelled' && (
                            <Button
                                fullWidth
                                size="md"
                                variant="light"
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
                        )}

                        {appointment.status ===
                            'completed' && (
                            <Text
                                size="sm"
                                c="dimmed"
                                ta="center"
                            >
                                This appointment has
                                been completed.
                            </Text>
                        )}

                    </Stack>
                </Stack>
            </Stack>
        </Drawer>
    )
}

export default AppointmentDetailsDrawer
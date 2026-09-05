import {
    Badge,
    Button,
    Card,
    Container,
    Divider,
    Group,
    Loader,
    Select,
    Stack,
    Table,
    Text,
    TextInput,
    Title,
} from '@mantine/core'
import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import AppointmentDetailsDrawer from '../components/AppointmentDetailsDrawer'

import {
    subscribeToAppointments,
    updateAppointmentStatus,
    type AdminAppointment,
    type AppointmentStatus,
} from '../services/appointmentAdminService'

function AdminAppointmentsPage() {
    const [
        appointments,
        setAppointments,
    ] = useState<AdminAppointment[]>(
        [],
    )

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState<string | null>(
            null,
        )

    const [search, setSearch] =
        useState('')

    const [
        statusFilter,
        setStatusFilter,
    ] = useState<string | null>(
        'all',
    )

    const [
        updatingId,
        setUpdatingId,
    ] = useState<string | null>(
        null,
    )

    const [
        selectedAppointment,
        setSelectedAppointment,
    ] =
        useState<AdminAppointment | null>(
            null,
        )

    /*
     * REALTIME APPOINTMENT LISTENER
     */
    useEffect(() => {
        const unsubscribe =
            subscribeToAppointments(
                (data) => {
                    setAppointments(
                        data,
                    )

                    setLoading(
                        false,
                    )

                    /*
                     * Keep selected appointment
                     * synchronized with realtime updates.
                     */
                    setSelectedAppointment(
                        (current) => {
                            if (!current) {
                                return null
                            }

                            const updated =
                                data.find(
                                    (
                                        appointment,
                                    ) =>
                                        appointment.id ===
                                        current.id,
                                )

                            return (
                                updated ??
                                null
                            )
                        },
                    )
                },
                (listenerError) => {
                    console.error(
                        'Failed to listen to appointments:',
                        listenerError,
                    )

                    setError(
                        'Unable to load appointments.',
                    )

                    setLoading(
                        false,
                    )
                },
            )

        return () => {
            unsubscribe()
        }
    }, [])

    /*
     * UPDATE APPOINTMENT STATUS
     */
    const handleStatusChange =
        async (
            appointmentId: string,
            status: AppointmentStatus,
        ) => {
            setUpdatingId(
                appointmentId,
            )

            setError(null)

            try {
                await updateAppointmentStatus(
                    appointmentId,
                    status,
                )
            } catch (error) {
                console.error(
                    'Failed to update appointment status:',
                    error,
                )

                setError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to update appointment status. Please try again.',
                )
            } finally {
                setUpdatingId(
                    null,
                )
            }
        }

    /*
     * FILTER APPOINTMENTS
     */
    const filteredAppointments =
        useMemo(() => {
            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase()

            return appointments
                .filter(
                    (
                        appointment,
                    ) => {
                        if (
                            !normalizedSearch
                        ) {
                            return true
                        }

                        return (
                            appointment.patient.fullName
                                .toLowerCase()
                                .includes(
                                    normalizedSearch,
                                ) ||
                            appointment.patient.email
                                .toLowerCase()
                                .includes(
                                    normalizedSearch,
                                ) ||
                            appointment.patient.phone
                                .toLowerCase()
                                .includes(
                                    normalizedSearch,
                                ) ||
                            appointment.serviceName
                                .toLowerCase()
                                .includes(
                                    normalizedSearch,
                                )
                        )
                    },
                )
                .filter(
                    (
                        appointment,
                    ) => {
                        if (
                            !statusFilter ||
                            statusFilter ===
                                'all'
                        ) {
                            return true
                        }

                        return (
                            appointment.status ===
                            statusFilter
                        )
                    },
                )
                .sort(
                    (a, b) => {
                        const dateComparison =
                            a.date.localeCompare(
                                b.date,
                            )

                        if (
                            dateComparison !==
                            0
                        ) {
                            return dateComparison
                        }

                        return a.time.localeCompare(
                            b.time,
                        )
                    },
                )
        }, [
            appointments,
            search,
            statusFilter,
        ])

    /*
     * STATUS COLOR
     */
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

    /*
     * STATUS LABEL
     */
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

    /*
     * FORMAT DATE
     */
    const formatDate = (
        date: string,
    ) => {
        const value =
            new Date(
                `${date}T00:00:00`,
            )

        return value.toLocaleDateString(
            'en-US',
            {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            },
        )
    }

    /*
     * APPOINTMENT ACTIONS
     */
    const renderAppointmentActions =
        (
            appointment: AdminAppointment,
        ) => {
            const isUpdating =
                updatingId ===
                appointment.id

            return (
                <Group
                    gap="xs"
                    wrap="nowrap"
                >
                    {appointment.status ===
                        'pending' && (
                        <Button
                            size="xs"
                            color="green"
                            variant="light"
                            loading={
                                isUpdating
                            }
                            onClick={() =>
                                handleStatusChange(
                                    appointment.id,
                                    'confirmed',
                                )
                            }
                        >
                            Confirm
                        </Button>
                    )}

                    {appointment.status ===
                        'confirmed' && (
                        <Button
                            size="xs"
                            color="teal"
                            variant="light"
                            loading={
                                isUpdating
                            }
                            onClick={() =>
                                handleStatusChange(
                                    appointment.id,
                                    'completed',
                                )
                            }
                        >
                            Complete
                        </Button>
                    )}

                    {(
                        appointment.status ===
                            'pending' ||
                        appointment.status ===
                            'confirmed'
                    ) && (
                        <Button
                            size="xs"
                            color="red"
                            variant="subtle"
                            loading={
                                isUpdating
                            }
                            onClick={() =>
                                handleStatusChange(
                                    appointment.id,
                                    'cancelled',
                                )
                            }
                        >
                            Cancel
                        </Button>
                    )}

                    {appointment.status ===
                        'cancelled' && (
                        <Button
                            size="xs"
                            variant="light"
                            loading={
                                isUpdating
                            }
                            onClick={() =>
                                handleStatusChange(
                                    appointment.id,
                                    'pending',
                                )
                            }
                        >
                            Reopen
                        </Button>
                    )}
                </Group>
            )
        }

    /*
     * MOBILE APPOINTMENT CARD
     */
    const renderMobileAppointment =
        (
            appointment: AdminAppointment,
        ) => {
            return (
                <Card
                    key={
                        appointment.id
                    }
                    withBorder
                    radius="xl"
                    padding="md"
                    onClick={() =>
                        setSelectedAppointment(
                            appointment,
                        )
                    }
                    style={{
                        cursor: 'pointer',
                    }}
                >
                    <Stack gap="md">
                        <Group
                            justify="space-between"
                            align="flex-start"
                            wrap="nowrap"
                        >
                            <Stack
                                gap={3}
                                style={{
                                    minWidth: 0,
                                }}
                            >
                                <Text
                                    fw={700}
                                    size="lg"
                                    truncate
                                >
                                    {
                                        appointment
                                            .patient
                                            .fullName
                                    }
                                </Text>

                                <Text
                                    size="sm"
                                    c="dimmed"
                                    truncate
                                >
                                    {
                                        appointment.serviceName
                                    }
                                </Text>
                            </Stack>

                            <Badge
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

                        <Divider />

                        <Group
                            grow
                            align="flex-start"
                        >
                            <Stack gap={2}>
                                <Text
                                    size="xs"
                                    c="dimmed"
                                    fw={600}
                                    tt="uppercase"
                                >
                                    Date
                                </Text>

                                <Text
                                    size="sm"
                                    fw={600}
                                >
                                    {formatDate(
                                        appointment.date,
                                    )}
                                </Text>
                            </Stack>

                            <Stack gap={2}>
                                <Text
                                    size="xs"
                                    c="dimmed"
                                    fw={600}
                                    tt="uppercase"
                                >
                                    Time
                                </Text>

                                <Text
                                    size="sm"
                                    fw={600}
                                >
                                    {
                                        appointment.time
                                    }
                                </Text>
                            </Stack>
                        </Group>

                        <Divider />

                        <Stack gap={2}>
                            <Text
                                size="xs"
                                c="dimmed"
                                fw={600}
                                tt="uppercase"
                            >
                                Contact
                            </Text>

                            <Text
                                size="sm"
                                truncate
                            >
                                {
                                    appointment
                                        .patient
                                        .phone
                                }
                            </Text>

                            <Text
                                size="xs"
                                c="dimmed"
                                truncate
                            >
                                {
                                    appointment
                                        .patient
                                        .email
                                }
                            </Text>
                        </Stack>

                        <Group
                            justify="space-between"
                        >
                            <Text
                                size="sm"
                                c="dimmed"
                            >
                                {
                                    appointment.duration
                                }{' '}
                                min
                            </Text>

                            <Text fw={700}>
                                ₱
                                {appointment.price.toLocaleString()}
                            </Text>
                        </Group>

                        <Divider />

                        <Group
                            onClick={(
                                event,
                            ) =>
                                event.stopPropagation()
                            }
                        >
                            {renderAppointmentActions(
                                appointment,
                            )}
                        </Group>
                    </Stack>
                </Card>
            )
        }

    return (
        <>
            <Container
                size="xl"
                py="md"
            >
                <Stack gap="md">
                    <Stack gap={4}>
                        <Title
                            order={1}
                            style={{
                                letterSpacing:
                                    '-0.04em',
                            }}
                        >
                            Appointments
                        </Title>

                        <Text
                            c="dimmed"
                            size="sm"
                        >
                            View and manage your
                            clinic appointments.
                        </Text>
                    </Stack>

                    {error && (
                        <Card
                            withBorder
                            radius="lg"
                            padding="md"
                        >
                            <Text
                                c="red"
                                size="sm"
                            >
                                {error}
                            </Text>
                        </Card>
                    )}

                    <Card
                        withBorder
                        radius="xl"
                        padding="md"
                    >
                        <Stack gap="md">
                            <TextInput
                                label="Search"
                                placeholder="Patient, email, phone, or service"
                                leftSection="🔎"
                                value={search}
                                onChange={(
                                    event,
                                ) =>
                                    setSearch(
                                        event
                                            .currentTarget
                                            .value,
                                    )
                                }
                            />

                            <Select
                                label="Status"
                                value={
                                    statusFilter
                                }
                                onChange={
                                    setStatusFilter
                                }
                                data={[
                                    {
                                        value: 'all',
                                        label: 'All statuses',
                                    },
                                    {
                                        value: 'pending',
                                        label: 'Pending',
                                    },
                                    {
                                        value: 'confirmed',
                                        label: 'Confirmed',
                                    },
                                    {
                                        value: 'completed',
                                        label: 'Completed',
                                    },
                                    {
                                        value: 'cancelled',
                                        label: 'Cancelled',
                                    },
                                ]}
                            />
                        </Stack>
                    </Card>

                    <Stack
                        gap="sm"
                        hiddenFrom="sm"
                    >
                        {loading ? (
                            <Card
                                withBorder
                                radius="xl"
                                padding="xl"
                            >
                                <Stack align="center">
                                    <Loader color="smilehaos" />

                                    <Text
                                        size="sm"
                                        c="dimmed"
                                    >
                                        Loading appointments...
                                    </Text>
                                </Stack>
                            </Card>
                        ) : filteredAppointments.length ===
                          0 ? (
                            <Card
                                withBorder
                                radius="xl"
                                padding="xl"
                            >
                                <Stack align="center">
                                    <Text fw={600}>
                                        No appointments
                                        found
                                    </Text>

                                    <Text
                                        size="sm"
                                        c="dimmed"
                                        ta="center"
                                    >
                                        Try changing
                                        your search
                                        or filters.
                                    </Text>
                                </Stack>
                            </Card>
                        ) : (
                            filteredAppointments.map(
                                (
                                    appointment,
                                ) =>
                                    renderMobileAppointment(
                                        appointment,
                                    ),
                            )
                        )}
                    </Stack>

                    <Card
                        withBorder
                        radius="xl"
                        padding={0}
                        visibleFrom="sm"
                        style={{
                            overflow:
                                'hidden',
                        }}
                    >
                        {loading ? (
                            <Stack
                                align="center"
                                py="xl"
                            >
                                <Loader color="smilehaos" />

                                <Text
                                    size="sm"
                                    c="dimmed"
                                >
                                    Loading appointments...
                                </Text>
                            </Stack>
                        ) : filteredAppointments.length ===
                          0 ? (
                            <Stack
                                align="center"
                                py="xl"
                            >
                                <Text fw={600}>
                                    No appointments
                                    found
                                </Text>

                                <Text
                                    size="sm"
                                    c="dimmed"
                                >
                                    Try changing
                                    your search
                                    or filters.
                                </Text>
                            </Stack>
                        ) : (
                            <Table.ScrollContainer
                                minWidth={1100}
                            >
                                <Table
                                    verticalSpacing="md"
                                    horizontalSpacing="lg"
                                    highlightOnHover
                                >
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>
                                                Date
                                            </Table.Th>
                                            <Table.Th>
                                                Time
                                            </Table.Th>
                                            <Table.Th>
                                                Patient
                                            </Table.Th>
                                            <Table.Th>
                                                Service
                                            </Table.Th>
                                            <Table.Th>
                                                Contact
                                            </Table.Th>
                                            <Table.Th>
                                                Price
                                            </Table.Th>
                                            <Table.Th>
                                                Status
                                            </Table.Th>
                                            <Table.Th>
                                                Actions
                                            </Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>

                                    <Table.Tbody>
                                        {filteredAppointments.map(
                                            (
                                                appointment,
                                            ) => (
                                                <Table.Tr
                                                    key={
                                                        appointment.id
                                                    }
                                                    style={{
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() =>
                                                        setSelectedAppointment(
                                                            appointment,
                                                        )
                                                    }
                                                >
                                                    <Table.Td>
                                                        <Text fw={600}>
                                                            {
                                                                appointment.date
                                                            }
                                                        </Text>
                                                    </Table.Td>

                                                    <Table.Td>
                                                        <Stack gap={0}>
                                                            <Text fw={600}>
                                                                {
                                                                    appointment.time
                                                                }
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
                                                        </Stack>
                                                    </Table.Td>

                                                    <Table.Td>
                                                        <Stack gap={2}>
                                                            <Text fw={600}>
                                                                {
                                                                    appointment
                                                                        .patient
                                                                        .fullName
                                                                }
                                                            </Text>

                                                            {appointment
                                                                .patient
                                                                .notes && (
                                                                <Text
                                                                    size="xs"
                                                                    c="dimmed"
                                                                    maw={220}
                                                                    truncate
                                                                >
                                                                    {
                                                                        appointment
                                                                            .patient
                                                                            .notes
                                                                    }
                                                                </Text>
                                                            )}
                                                        </Stack>
                                                    </Table.Td>

                                                    <Table.Td>
                                                        <Text size="sm">
                                                            {
                                                                appointment.serviceName
                                                            }
                                                        </Text>
                                                    </Table.Td>

                                                    <Table.Td>
                                                        <Stack gap={2}>
                                                            <Text size="sm">
                                                                {
                                                                    appointment
                                                                        .patient
                                                                        .phone
                                                                }
                                                            </Text>

                                                            <Text
                                                                size="xs"
                                                                c="dimmed"
                                                            >
                                                                {
                                                                    appointment
                                                                        .patient
                                                                        .email
                                                                }
                                                            </Text>
                                                        </Stack>
                                                    </Table.Td>

                                                    <Table.Td>
                                                        <Text fw={600}>
                                                            ₱
                                                            {appointment.price.toLocaleString()}
                                                        </Text>
                                                    </Table.Td>

                                                    <Table.Td>
                                                        <Badge
                                                            color={getStatusColor(
                                                                appointment.status,
                                                            )}
                                                            variant="light"
                                                        >
                                                            {getStatusLabel(
                                                                appointment.status,
                                                            )}
                                                        </Badge>
                                                    </Table.Td>

                                                    <Table.Td
                                                        onClick={(
                                                            event,
                                                        ) =>
                                                            event.stopPropagation()
                                                        }
                                                    >
                                                        {renderAppointmentActions(
                                                            appointment,
                                                        )}
                                                    </Table.Td>
                                                </Table.Tr>
                                            ),
                                        )}
                                    </Table.Tbody>
                                </Table>
                            </Table.ScrollContainer>
                        )}
                    </Card>

                    {!loading && (
                        <Text
                            size="sm"
                            c="dimmed"
                        >
                            Showing{' '}
                            <strong>
                                {
                                    filteredAppointments.length
                                }
                            </strong>{' '}
                            of{' '}
                            <strong>
                                {
                                    appointments.length
                                }
                            </strong>{' '}
                            appointments
                        </Text>
                    )}
                </Stack>
            </Container>

            <AppointmentDetailsDrawer
                appointment={
                    selectedAppointment
                }
                opened={
                    selectedAppointment !==
                    null
                }
                onClose={() =>
                    setSelectedAppointment(
                        null,
                    )
                }
                onStatusChange={
                    handleStatusChange
                }
                updatingId={
                    updatingId
                }
            />
        </>
    )
}

export default AdminAppointmentsPage
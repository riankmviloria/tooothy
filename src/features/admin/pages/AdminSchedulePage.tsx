import {
    ActionIcon,
    Badge,
    Button,
    Card,
    Container,
    Divider,
    Group,
    Loader,
    Modal,
    Stack,
    Switch,
    Text,
    TextInput,
    Title,
} from '@mantine/core'
import {
    useEffect,
    useState,
} from 'react'

import {
    defaultSchedule,
    saveSchedule,
    subscribeToSchedule,
    type DaySchedule,
    type SchedulePeriod,
    type WeeklySchedule,
} from '../services/scheduleService'

import {
    blockDate,
    subscribeToBlockedDates,
    unblockDate,
    type AdminBlockedDate,
} from '../services/blockedDateAdminService'

type DayKey =
    keyof WeeklySchedule

type DayDefinition = {
    key: DayKey
    label: string
}

const days: DayDefinition[] = [
    {
        key: 'monday',
        label: 'Monday',
    },
    {
        key: 'tuesday',
        label: 'Tuesday',
    },
    {
        key: 'wednesday',
        label: 'Wednesday',
    },
    {
        key: 'thursday',
        label: 'Thursday',
    },
    {
        key: 'friday',
        label: 'Friday',
    },
    {
        key: 'saturday',
        label: 'Saturday',
    },
    {
        key: 'sunday',
        label: 'Sunday',
    },
]

function AdminSchedulePage() {
    const [
        schedule,
        setSchedule,
    ] = useState<WeeklySchedule>(
        defaultSchedule,
    )

    const [
        loadingSchedule,
        setLoadingSchedule,
    ] = useState(true)

    const [
        savingSchedule,
        setSavingSchedule,
    ] = useState(false)

    const [
        blockedDates,
        setBlockedDates,
    ] = useState<
        AdminBlockedDate[]
    >([])

    const [
        loadingBlockedDates,
        setLoadingBlockedDates,
    ] = useState(true)

    const [
        modalOpened,
        setModalOpened,
    ] = useState(false)

    const [
        selectedDate,
        setSelectedDate,
    ] = useState('')

    const [reason, setReason] =
        useState('')

    const [savingDate, setSavingDate] =
        useState(false)

    const [
        removingDate,
        setRemovingDate,
    ] = useState<string | null>(
        null,
    )

    const [
        error,
        setError,
    ] = useState<string | null>(
        null,
    )

    /*
     * TODAY
     */
    const today =
        (() => {
            const date =
                new Date()

            const year =
                date.getFullYear()

            const month =
                String(
                    date.getMonth() + 1,
                ).padStart(
                    2,
                    '0',
                )

            const day =
                String(
                    date.getDate(),
                ).padStart(
                    2,
                    '0',
                )

            return `${year}-${month}-${day}`
        })()

    /*
     * LOAD WEEKLY SCHEDULE
     */
    useEffect(() => {
        const unsubscribe =
            subscribeToSchedule(
                (data) => {
                    setSchedule(data)
                    setLoadingSchedule(false)
                },
                (listenerError) => {
                    console.error(
                        'Failed to load schedule:',
                        listenerError,
                    )

                    setError(
                        'Unable to load clinic schedule.',
                    )

                    setLoadingSchedule(false)
                },
            )

        return () => {
            unsubscribe()
        }
    }, [])

    /*
     * LOAD BLOCKED DATES
     */
    useEffect(() => {
        const unsubscribe =
            subscribeToBlockedDates(
                (data) => {
                    setBlockedDates(data)
                    setLoadingBlockedDates(
                        false,
                    )
                },
                (listenerError) => {
                    console.error(
                        'Failed to load blocked dates:',
                        listenerError,
                    )

                    setError(
                        'Unable to load blocked dates.',
                    )

                    setLoadingBlockedDates(
                        false,
                    )
                },
            )

        return () => {
            unsubscribe()
        }
    }, [])

    /*
     * UPDATE DAY
     */
    const updateDay = (
        day: DayKey,
        updates: Partial<DaySchedule>,
    ) => {
        setSchedule(
            (current) => ({
                ...current,
                [day]: {
                    ...current[day],
                    ...updates,
                },
            }),
        )
    }

    /*
     * UPDATE PERIOD
     */
    const updatePeriod = (
        day: DayKey,
        periodIndex: number,
        updates: Partial<SchedulePeriod>,
    ) => {
        setSchedule(
            (current) => {
                const periods = [
                    ...current[
                        day
                    ].periods,
                ]

                periods[
                    periodIndex
                ] = {
                    ...periods[
                        periodIndex
                    ],
                    ...updates,
                }

                return {
                    ...current,
                    [day]: {
                        ...current[
                            day
                        ],
                        periods,
                    },
                }
            },
        )
    }

    /*
     * ADD PERIOD
     */
    const addPeriod = (
        day: DayKey,
    ) => {
        setSchedule(
            (current) => ({
                ...current,
                [day]: {
                    ...current[day],
                    periods: [
                        ...current[
                            day
                        ].periods,
                        {
                            startTime:
                                '09:00',
                            endTime:
                                '17:00',
                        },
                    ],
                },
            }),
        )
    }

    /*
     * REMOVE PERIOD
     */
    const removePeriod = (
        day: DayKey,
        periodIndex: number,
    ) => {
        setSchedule(
            (current) => ({
                ...current,
                [day]: {
                    ...current[day],
                    periods:
                        current[
                            day
                        ].periods.filter(
                            (
                                _,
                                index,
                            ) =>
                                index !==
                                periodIndex,
                        ),
                },
            }),
        )
    }

    /*
     * SAVE SCHEDULE
     */
    const handleSaveSchedule =
        async () => {
            setSavingSchedule(true)
            setError(null)

            try {
                await saveSchedule(
                    schedule,
                )
            } catch (error) {
                console.error(
                    'Failed to save schedule:',
                    error,
                )

                setError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to save clinic schedule.',
                )
            } finally {
                setSavingSchedule(false)
            }
        }

    /*
     * OPEN BLOCK DATE MODAL
     */
    const openBlockModal =
        () => {
            setSelectedDate('')
            setReason('')
            setError(null)
            setModalOpened(true)
        }

    /*
     * CLOSE BLOCK DATE MODAL
     */
    const closeBlockModal =
        () => {
            if (savingDate) {
                return
            }

            setModalOpened(false)
            setSelectedDate('')
            setReason('')
        }

    /*
     * BLOCK DATE
     */
    const handleBlockDate =
        async () => {
            setError(null)

            if (!selectedDate) {
                setError(
                    'Please select a date.',
                )

                return
            }

            if (!reason.trim()) {
                setError(
                    'Please provide a reason.',
                )

                return
            }

            setSavingDate(true)

            try {
                await blockDate(
                    selectedDate,
                    reason,
                )

                setModalOpened(
                    false,
                )

                setSelectedDate('')
                setReason('')
            } catch (error) {
                console.error(
                    'Failed to block date:',
                    error,
                )

                setError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to block this date.',
                )
            } finally {
                setSavingDate(
                    false,
                )
            }
        }

    /*
     * UNBLOCK DATE
     */
    const handleUnblockDate =
        async (
            date: string,
        ) => {
            setRemovingDate(
                date,
            )

            setError(null)

            try {
                await unblockDate(
                    date,
                )
            } catch (error) {
                console.error(
                    'Failed to unblock date:',
                    error,
                )

                setError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to unblock this date.',
                )
            } finally {
                setRemovingDate(
                    null,
                )
            }
        }

    /*
     * FORMAT DATE
     */
    const formatDate =
        (date: string) => {
            const value =
                new Date(
                    `${date}T00:00:00`,
                )

            return value.toLocaleDateString(
                'en-US',
                {
                    weekday:
                        'long',
                    month:
                        'long',
                    day:
                        'numeric',
                    year:
                        'numeric',
                },
            )
        }

    return (
        <>
            <Container
                size="xl"
                py="md"
            >
                <Stack gap="xl">

                    {/* HEADER */}

                    <Group
                        justify="space-between"
                        align="flex-start"
                    >
                        <Stack gap={4}>
                            <Title
                                order={1}
                                style={{
                                    letterSpacing:
                                        '-0.04em',
                                }}
                            >
                                Schedule
                            </Title>

                            <Text c="dimmed">
                                Set your clinic's
                                regular operating hours
                                and blocked dates.
                            </Text>
                        </Stack>
                    </Group>

                    {/* ERROR */}

                    {error && (
                        <Card
                            withBorder
                            radius="lg"
                        >
                            <Text
                                c="red"
                                size="sm"
                            >
                                {error}
                            </Text>
                        </Card>
                    )}

                    {/* WEEKLY SCHEDULE */}

                    <Card
                        withBorder
                        radius="xl"
                        padding="lg"
                    >
                        <Stack gap="lg">

                            <Group
                                justify="space-between"
                                align="flex-start"
                            >
                                <Stack gap={2}>
                                    <Title
                                        order={2}
                                        size="1.2rem"
                                    >
                                        Weekly schedule
                                    </Title>

                                    <Text
                                        size="sm"
                                        c="dimmed"
                                    >
                                        Configure the days and
                                        hours patients can book.
                                    </Text>
                                </Stack>

                                <Button
                                    loading={
                                        savingSchedule
                                    }
                                    onClick={
                                        handleSaveSchedule
                                    }
                                >
                                    Save schedule
                                </Button>
                            </Group>

                            <Divider />

                            {loadingSchedule ? (
                                <Stack
                                    align="center"
                                    py="xl"
                                >
                                    <Loader
                                        color="smilehaos"
                                    />

                                    <Text
                                        size="sm"
                                        c="dimmed"
                                    >
                                        Loading schedule...
                                    </Text>
                                </Stack>
                            ) : (
                                <Stack gap="md">
                                    {days.map(
                                        (
                                            day,
                                        ) => {
                                            const daySchedule =
                                                schedule[
                                                    day.key
                                                ]

                                            return (
                                                <Card
                                                    key={
                                                        day.key
                                                    }
                                                    withBorder
                                                    radius="lg"
                                                    padding="md"
                                                >
                                                    <Stack gap="md">

                                                        <Group
                                                            justify="space-between"
                                                            align="center"
                                                        >
                                                            <Group
                                                                gap="sm"
                                                            >
                                                                <Text
                                                                    fw={700}
                                                                >
                                                                    {
                                                                        day.label
                                                                    }
                                                                </Text>

                                                                <Badge
                                                                    variant="light"
                                                                    color={
                                                                        daySchedule.enabled
                                                                            ? 'green'
                                                                            : 'gray'
                                                                    }
                                                                >
                                                                    {daySchedule.enabled
                                                                        ? 'Open'
                                                                        : 'Closed'}
                                                                </Badge>
                                                            </Group>

                                                            <Switch
                                                                checked={
                                                                    daySchedule.enabled
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    updateDay(
                                                                        day.key,
                                                                        {
                                                                            enabled:
                                                                                event
                                                                                    .currentTarget
                                                                                    .checked,
                                                                        },
                                                                    )
                                                                }
                                                                label={
                                                                    daySchedule.enabled
                                                                        ? 'Open'
                                                                        : 'Closed'
                                                                }
                                                            />
                                                        </Group>

                                                        {daySchedule.enabled && (
                                                            <Stack gap="sm">
                                                                {daySchedule.periods.map(
                                                                    (
                                                                        period,
                                                                        periodIndex,
                                                                    ) => (
                                                                        <Group
                                                                            key={
                                                                                `${day.key}-${periodIndex}`
                                                                            }
                                                                            align="flex-end"
                                                                            wrap="nowrap"
                                                                        >
                                                                            <TextInput
                                                                                type="time"
                                                                                label={
                                                                                    periodIndex ===
                                                                                    0
                                                                                        ? 'From'
                                                                                        : undefined
                                                                                }
                                                                                value={
                                                                                    period.startTime
                                                                                }
                                                                                onChange={(
                                                                                    event,
                                                                                ) =>
                                                                                    updatePeriod(
                                                                                        day.key,
                                                                                        periodIndex,
                                                                                        {
                                                                                            startTime:
                                                                                                event
                                                                                                    .currentTarget
                                                                                                    .value,
                                                                                        },
                                                                                    )
                                                                                }
                                                                                style={{
                                                                                    flex: 1,
                                                                                }}
                                                                            />

                                                                            <TextInput
                                                                                type="time"
                                                                                label={
                                                                                    periodIndex ===
                                                                                    0
                                                                                        ? 'To'
                                                                                        : undefined
                                                                                }
                                                                                value={
                                                                                    period.endTime
                                                                                }
                                                                                onChange={(
                                                                                    event,
                                                                                ) =>
                                                                                    updatePeriod(
                                                                                        day.key,
                                                                                        periodIndex,
                                                                                        {
                                                                                            endTime:
                                                                                                event
                                                                                                    .currentTarget
                                                                                                    .value,
                                                                                        },
                                                                                    )
                                                                                }
                                                                                style={{
                                                                                    flex: 1,
                                                                                }}
                                                                            />

                                                                            <ActionIcon
                                                                                color="red"
                                                                                variant="light"
                                                                                size="lg"
                                                                                disabled={
                                                                                    daySchedule
                                                                                        .periods
                                                                                        .length <=
                                                                                    1
                                                                                }
                                                                                onClick={() =>
                                                                                    removePeriod(
                                                                                        day.key,
                                                                                        periodIndex,
                                                                                    )
                                                                                }
                                                                                aria-label="Remove time period"
                                                                            >
                                                                                ×
                                                                            </ActionIcon>
                                                                        </Group>
                                                                    ),
                                                                )}

                                                                <Button
                                                                    variant="light"
                                                                    size="sm"
                                                                    w="fit-content"
                                                                    onClick={() =>
                                                                        addPeriod(
                                                                            day.key,
                                                                        )
                                                                    }
                                                                >
                                                                    + Add time period
                                                                </Button>
                                                            </Stack>
                                                        )}
                                                    </Stack>
                                                </Card>
                                            )
                                        },
                                    )}
                                </Stack>
                            )}
                        </Stack>
                    </Card>

                    {/* BLOCKED DATES */}

                    <Card
                        withBorder
                        radius="xl"
                        padding="lg"
                    >
                        <Stack gap="lg">

                            <Group
                                justify="space-between"
                                align="flex-start"
                            >
                                <Stack gap={2}>
                                    <Title
                                        order={2}
                                        size="1.2rem"
                                    >
                                        Blocked dates
                                    </Title>

                                    <Text
                                        size="sm"
                                        c="dimmed"
                                    >
                                        Temporarily close the
                                        clinic on specific dates.
                                    </Text>
                                </Stack>

                                <Button
                                    onClick={
                                        openBlockModal
                                    }
                                >
                                    + Block date
                                </Button>
                            </Group>

                            <Divider />

                            {loadingBlockedDates ? (
                                <Stack
                                    align="center"
                                    py="xl"
                                >
                                    <Loader
                                        color="smilehaos"
                                    />

                                    <Text
                                        size="sm"
                                        c="dimmed"
                                    >
                                        Loading blocked
                                        dates...
                                    </Text>
                                </Stack>
                            ) : blockedDates.length ===
                              0 ? (
                                <Stack
                                    align="center"
                                    py="xl"
                                >
                                    <Text
                                        size="2rem"
                                    >
                                        🗓️
                                    </Text>

                                    <Text
                                        fw={600}
                                    >
                                        No blocked dates
                                    </Text>

                                    <Text
                                        size="sm"
                                        c="dimmed"
                                        ta="center"
                                    >
                                        No additional clinic
                                        closures have been
                                        configured.
                                    </Text>
                                </Stack>
                            ) : (
                                <Stack gap="sm">
                                    {blockedDates.map(
                                        (
                                            blockedDate,
                                        ) => {
                                            const isRemoving =
                                                removingDate ===
                                                blockedDate.date

                                            return (
                                                <Card
                                                    key={
                                                        blockedDate.id
                                                    }
                                                    withBorder
                                                    radius="lg"
                                                    padding="md"
                                                >
                                                    <Group
                                                        justify="space-between"
                                                        align="center"
                                                        wrap="nowrap"
                                                    >
                                                        <Stack
                                                            gap={4}
                                                            style={{
                                                                minWidth: 0,
                                                            }}
                                                        >
                                                            <Text
                                                                fw={700}
                                                            >
                                                                {formatDate(
                                                                    blockedDate.date,
                                                                )}
                                                            </Text>

                                                            <Text
                                                                size="sm"
                                                                c="dimmed"
                                                            >
                                                                {
                                                                    blockedDate.reason
                                                                }
                                                            </Text>
                                                        </Stack>

                                                        <Button
                                                            size="sm"
                                                            variant="light"
                                                            color="red"
                                                            loading={
                                                                isRemoving
                                                            }
                                                            onClick={() =>
                                                                handleUnblockDate(
                                                                    blockedDate.date,
                                                                )
                                                            }
                                                        >
                                                            Unblock
                                                        </Button>
                                                    </Group>
                                                </Card>
                                            )
                                        },
                                    )}
                                </Stack>
                            )}
                        </Stack>
                    </Card>
                </Stack>
            </Container>

            {/* BLOCK DATE MODAL */}

            <Modal
                opened={
                    modalOpened
                }
                onClose={
                    closeBlockModal
                }
                title={
                    <Text
                        fw={700}
                    >
                        Block a date
                    </Text>
                }
                centered
            >
                <Stack gap="lg">

                    <Text
                        size="sm"
                        c="dimmed"
                    >
                        Patients will not be able to
                        book appointments on this date.
                    </Text>

                    <TextInput
                        label="Date"
                        type="date"
                        value={
                            selectedDate
                        }
                        onChange={(
                            event,
                        ) =>
                            setSelectedDate(
                                event
                                    .currentTarget
                                    .value,
                            )
                        }
                        min={today}
                        required
                    />

                    <TextInput
                        label="Reason"
                        placeholder="e.g. Holiday, dentist unavailable"
                        value={
                            reason
                        }
                        onChange={(
                            event,
                        ) =>
                            setReason(
                                event
                                    .currentTarget
                                    .value,
                            )
                        }
                        required
                    />

                    {error && (
                        <Text
                            c="red"
                            size="sm"
                        >
                            {error}
                        </Text>
                    )}

                    <Group
                        justify="flex-end"
                    >
                        <Button
                            variant="subtle"
                            onClick={
                                closeBlockModal
                            }
                            disabled={
                                savingDate
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            loading={
                                savingDate
                            }
                            onClick={
                                handleBlockDate
                            }
                        >
                            Block date
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    )
}

export default AdminSchedulePage
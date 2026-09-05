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
    SimpleGrid,
    Stack,
    Switch,
    Text,
    TextInput,
    Title,
} from '@mantine/core'
import {
    IconCalendarOff,
    IconCheck,
    IconClock,
    IconPlus,
    IconTrash,
} from '@tabler/icons-react'
import {
    motion,
} from 'motion/react'
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

    /*
     * SCHEDULE SUMMARY
     */

    const openDays =
        days.filter(
            (day) =>
                schedule[
                    day.key
                ].enabled,
        ).length

    const closedDays =
        days.length -
        openDays

    return (
        <>
            <Container
                size="xl"
                py="xl"
            >
                <Stack gap={32}>

                    {/* ================================================== */}
                    {/* PAGE HEADER */}
                    {/* ================================================== */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 12,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.35,
                        }}
                    >
                        <Group
                            justify="space-between"
                            align="flex-end"
                            gap="xl"
                            wrap="wrap"
                        >
                            <Stack gap={6}>
                                <Badge
                                    variant="light"
                                    color="smilehaos"
                                    radius="xl"
                                    w="fit-content"
                                >
                                    Clinic management
                                </Badge>

                                <Title
                                    order={1}
                                    style={{
                                        letterSpacing:
                                            '-0.04em',
                                    }}
                                >
                                    Schedule
                                </Title>

                                <Text
                                    c="dimmed"
                                    size="sm"
                                    maw={620}
                                >
                                    Manage your regular
                                    clinic hours and
                                    temporarily close
                                    specific dates when
                                    patients cannot book.
                                </Text>
                            </Stack>

                            <Button
                                size="md"
                                radius="lg"
                                leftSection={
                                    <IconCalendarOff
                                        size={18}
                                    />
                                }
                                onClick={
                                    openBlockModal
                                }
                            >
                                Block a date
                            </Button>
                        </Group>
                    </motion.div>

                    {/* ================================================== */}
                    {/* ERROR */}
                    {/* ================================================== */}

                    {error && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: -6,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                        >
                            <Card
                                withBorder
                                radius="lg"
                                padding="md"
                                style={{
                                    borderColor:
                                        'var(--mantine-color-red-3)',
                                    background:
                                        'var(--mantine-color-red-0)',
                                }}
                            >
                                <Text
                                    c="red"
                                    size="sm"
                                    fw={600}
                                >
                                    {error}
                                </Text>
                            </Card>
                        </motion.div>
                    )}

                    {/* ================================================== */}
                    {/* SUMMARY */}
                    {/* ================================================== */}

                    <SimpleGrid
                        cols={{
                            base: 1,
                            sm: 3,
                        }}
                        spacing="md"
                    >
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: 0.05,
                                duration: 0.3,
                            }}
                        >
                            <Card
                                withBorder
                                radius="xl"
                                padding="lg"
                                style={{
                                    height: '100%',
                                }}
                            >
                                <Group
                                    justify="space-between"
                                    align="flex-start"
                                >
                                    <Stack gap={3}>
                                        <Text
                                            size="xs"
                                            fw={700}
                                            c="dimmed"
                                            tt="uppercase"
                                            style={{
                                                letterSpacing:
                                                    '0.07em',
                                            }}
                                        >
                                            Open days
                                        </Text>

                                        <Text
                                            size="2rem"
                                            fw={800}
                                            lh={1}
                                        >
                                            {openDays}
                                        </Text>

                                        <Text
                                            size="xs"
                                            c="dimmed"
                                        >
                                            Days available
                                            for booking
                                        </Text>
                                    </Stack>

                                    <Badge
                                        color="green"
                                        variant="light"
                                        radius="xl"
                                    >
                                        Open
                                    </Badge>
                                </Group>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: 0.1,
                                duration: 0.3,
                            }}
                        >
                            <Card
                                withBorder
                                radius="xl"
                                padding="lg"
                                style={{
                                    height: '100%',
                                }}
                            >
                                <Group
                                    justify="space-between"
                                    align="flex-start"
                                >
                                    <Stack gap={3}>
                                        <Text
                                            size="xs"
                                            fw={700}
                                            c="dimmed"
                                            tt="uppercase"
                                            style={{
                                                letterSpacing:
                                                    '0.07em',
                                            }}
                                        >
                                            Closed days
                                        </Text>

                                        <Text
                                            size="2rem"
                                            fw={800}
                                            lh={1}
                                        >
                                            {closedDays}
                                        </Text>

                                        <Text
                                            size="xs"
                                            c="dimmed"
                                        >
                                            Regular weekly
                                            closures
                                        </Text>
                                    </Stack>

                                    <Badge
                                        color="gray"
                                        variant="light"
                                        radius="xl"
                                    >
                                        Closed
                                    </Badge>
                                </Group>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: 0.15,
                                duration: 0.3,
                            }}
                        >
                            <Card
                                withBorder
                                radius="xl"
                                padding="lg"
                                style={{
                                    height: '100%',
                                }}
                            >
                                <Group
                                    justify="space-between"
                                    align="flex-start"
                                >
                                    <Stack gap={3}>
                                        <Text
                                            size="xs"
                                            fw={700}
                                            c="dimmed"
                                            tt="uppercase"
                                            style={{
                                                letterSpacing:
                                                    '0.07em',
                                            }}
                                        >
                                            Blocked dates
                                        </Text>

                                        <Text
                                            size="2rem"
                                            fw={800}
                                            lh={1}
                                        >
                                            {
                                                blockedDates.length
                                            }
                                        </Text>

                                        <Text
                                            size="xs"
                                            c="dimmed"
                                        >
                                            Additional closures
                                        </Text>
                                    </Stack>

                                    <IconCalendarOff
                                        size={24}
                                        stroke={1.7}
                                    />
                                </Group>
                            </Card>
                        </motion.div>
                    </SimpleGrid>

                    {/* ================================================== */}
                    {/* WEEKLY SCHEDULE */}
                    {/* ================================================== */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 15,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.18,
                            duration: 0.35,
                        }}
                    >
                        <Card
                            withBorder
                            radius="xl"
                            padding="xl"
                        >
                            <Stack gap="xl">

                                <Group
                                    justify="space-between"
                                    align="flex-start"
                                    gap="lg"
                                    wrap="wrap"
                                >
                                    <Stack gap={4}>
                                        <Group gap="sm">
                                            <Title
                                                order={2}
                                                size="1.25rem"
                                            >
                                                Weekly schedule
                                            </Title>

                                            <Badge
                                                variant="light"
                                                color="smilehaos"
                                                radius="xl"
                                            >
                                                Recurring
                                            </Badge>
                                        </Group>

                                        <Text
                                            size="sm"
                                            c="dimmed"
                                        >
                                            Configure the days
                                            and hours patients
                                            can book.
                                        </Text>
                                    </Stack>

                                    <Button
                                        loading={
                                            savingSchedule
                                        }
                                        radius="lg"
                                        leftSection={
                                            <IconCheck
                                                size={18}
                                            />
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
                                        justify="center"
                                        py={60}
                                    >
                                        <Loader
                                            color="smilehaos"
                                            size="md"
                                        />

                                        <Text
                                            size="sm"
                                            c="dimmed"
                                        >
                                            Loading clinic
                                            schedule...
                                        </Text>
                                    </Stack>
                                ) : (
                                    <Stack gap="sm">
                                        {days.map(
                                            (
                                                day,
                                                dayIndex,
                                            ) => {
                                                const daySchedule =
                                                    schedule[
                                                        day.key
                                                    ]

                                                return (
                                                    <motion.div
                                                        key={
                                                            day.key
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
                                                            delay:
                                                                0.03 *
                                                                dayIndex,
                                                            duration:
                                                                0.25,
                                                        }}
                                                    >
                                                        <Card
                                                            withBorder
                                                            radius="lg"
                                                            padding="lg"
                                                            style={{
                                                                background:
                                                                    daySchedule.enabled
                                                                        ? undefined
                                                                        : 'var(--mantine-color-gray-0)',
                                                                transition:
                                                                    'border-color 150ms ease, box-shadow 150ms ease',
                                                            }}
                                                        >
                                                            <Stack gap="lg">

                                                                {/* DAY HEADER */}

                                                                <Group
                                                                    justify="space-between"
                                                                    align="center"
                                                                    gap="md"
                                                                    wrap="wrap"
                                                                >
                                                                    <Group
                                                                        gap="sm"
                                                                    >
                                                                        <Stack
                                                                            gap={2}
                                                                        >
                                                                            <Text
                                                                                fw={750}
                                                                                size="sm"
                                                                            >
                                                                                {
                                                                                    day.label
                                                                                }
                                                                            </Text>

                                                                            <Text
                                                                                size="xs"
                                                                                c="dimmed"
                                                                            >
                                                                                {daySchedule.enabled
                                                                                    ? 'Patients can book on this day'
                                                                                    : 'No appointments available'}
                                                                            </Text>
                                                                        </Stack>

                                                                        <Badge
                                                                            variant="light"
                                                                            color={
                                                                                daySchedule.enabled
                                                                                    ? 'green'
                                                                                    : 'gray'
                                                                            }
                                                                            radius="xl"
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

                                                                {/* PERIODS */}

                                                                {daySchedule.enabled && (
                                                                    <Stack gap="sm">

                                                                        {daySchedule.periods.map(
                                                                            (
                                                                                period,
                                                                                periodIndex,
                                                                            ) => (
                                                                                <motion.div
                                                                                    key={`${day.key}-${periodIndex}`}
                                                                                    initial={{
                                                                                        opacity: 0,
                                                                                    }}
                                                                                    animate={{
                                                                                        opacity: 1,
                                                                                    }}
                                                                                >
                                                                                    <Card
                                                                                        radius="lg"
                                                                                        padding="md"
                                                                                        style={{
                                                                                            background:
                                                                                                'var(--mantine-color-gray-0)',
                                                                                        }}
                                                                                    >
                                                                                        <Group
                                                                                            align="flex-end"
                                                                                            wrap="nowrap"
                                                                                            gap="sm"
                                                                                        >
                                                                                            <IconClock
                                                                                                size={18}
                                                                                                stroke={1.8}
                                                                                                style={{
                                                                                                    marginBottom:
                                                                                                        9,
                                                                                                }}
                                                                                            />

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
                                                                                                radius="lg"
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
                                                                                                <IconTrash
                                                                                                    size={
                                                                                                        17
                                                                                                    }
                                                                                                />
                                                                                            </ActionIcon>
                                                                                        </Group>
                                                                                    </Card>
                                                                                </motion.div>
                                                                            ),
                                                                        )}

                                                                        <Button
                                                                            variant="light"
                                                                            size="sm"
                                                                            radius="lg"
                                                                            w="fit-content"
                                                                            leftSection={
                                                                                <IconPlus
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                            }
                                                                            onClick={() =>
                                                                                addPeriod(
                                                                                    day.key,
                                                                                )
                                                                            }
                                                                        >
                                                                            Add time period
                                                                        </Button>

                                                                    </Stack>
                                                                )}

                                                            </Stack>
                                                        </Card>
                                                    </motion.div>
                                                )
                                            },
                                        )}
                                    </Stack>
                                )}

                            </Stack>
                        </Card>
                    </motion.div>

                    {/* ================================================== */}
                    {/* BLOCKED DATES */}
                    {/* ================================================== */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 15,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.25,
                            duration: 0.35,
                        }}
                    >
                        <Card
                            withBorder
                            radius="xl"
                            padding="xl"
                        >
                            <Stack gap="xl">

                                <Group
                                    justify="space-between"
                                    align="flex-start"
                                    gap="lg"
                                    wrap="wrap"
                                >
                                    <Stack gap={4}>
                                        <Group gap="sm">
                                            <Title
                                                order={2}
                                                size="1.25rem"
                                            >
                                                Blocked dates
                                            </Title>

                                            <Badge
                                                variant="light"
                                                color="red"
                                                radius="xl"
                                            >
                                                Closures
                                            </Badge>
                                        </Group>

                                        <Text
                                            size="sm"
                                            c="dimmed"
                                        >
                                            Temporarily close
                                            the clinic on
                                            specific dates.
                                        </Text>
                                    </Stack>

                                    <Button
                                        radius="lg"
                                        leftSection={
                                            <IconPlus
                                                size={18}
                                            />
                                        }
                                        onClick={
                                            openBlockModal
                                        }
                                    >
                                        Block date
                                    </Button>
                                </Group>

                                <Divider />

                                {loadingBlockedDates ? (
                                    <Stack
                                        align="center"
                                        justify="center"
                                        py={60}
                                    >
                                        <Loader
                                            color="smilehaos"
                                            size="md"
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
                                    <Card
                                        radius="lg"
                                        padding={40}
                                        style={{
                                            background:
                                                'var(--mantine-color-gray-0)',
                                        }}
                                    >
                                        <Stack
                                            align="center"
                                            gap="sm"
                                        >
                                            <IconCalendarOff
                                                size={36}
                                                stroke={1.5}
                                            />

                                            <Stack
                                                align="center"
                                                gap={3}
                                            >
                                                <Text
                                                    fw={700}
                                                >
                                                    No blocked
                                                    dates
                                                </Text>

                                                <Text
                                                    size="sm"
                                                    c="dimmed"
                                                    ta="center"
                                                    maw={420}
                                                >
                                                    No additional
                                                    clinic
                                                    closures have
                                                    been
                                                    configured.
                                                </Text>
                                            </Stack>

                                            <Button
                                                variant="light"
                                                radius="lg"
                                                leftSection={
                                                    <IconPlus
                                                        size={
                                                            16
                                                        }
                                                    />
                                                }
                                                onClick={
                                                    openBlockModal
                                                }
                                            >
                                                Add blocked
                                                date
                                            </Button>
                                        </Stack>
                                    </Card>
                                ) : (
                                    <Stack gap="sm">
                                        {blockedDates.map(
                                            (
                                                blockedDate,
                                                index,
                                            ) => {
                                                const isRemoving =
                                                    removingDate ===
                                                    blockedDate.date

                                                return (
                                                    <motion.div
                                                        key={
                                                            blockedDate.id
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
                                                            delay:
                                                                0.04 *
                                                                index,
                                                        }}
                                                    >
                                                        <Card
                                                            withBorder
                                                            radius="lg"
                                                            padding="lg"
                                                        >
                                                            <Group
                                                                justify="space-between"
                                                                align="center"
                                                                gap="lg"
                                                                wrap="wrap"
                                                            >
                                                                <Group
                                                                    gap="md"
                                                                    wrap="nowrap"
                                                                >
                                                                    <Card
                                                                        radius="lg"
                                                                        padding="sm"
                                                                        style={{
                                                                            background:
                                                                                'var(--mantine-color-red-0)',
                                                                            flexShrink: 0,
                                                                        }}
                                                                    >
                                                                        <IconCalendarOff
                                                                            size={
                                                                                22
                                                                            }
                                                                            stroke={
                                                                                1.7
                                                                            }
                                                                        />
                                                                    </Card>

                                                                    <Stack
                                                                        gap={
                                                                            3
                                                                        }
                                                                        style={{
                                                                            minWidth: 0,
                                                                        }}
                                                                    >
                                                                        <Group
                                                                            gap="sm"
                                                                        >
                                                                            <Text
                                                                                fw={
                                                                                    700
                                                                                }
                                                                                size="sm"
                                                                            >
                                                                                {formatDate(
                                                                                    blockedDate.date,
                                                                                )}
                                                                            </Text>

                                                                            <Badge
                                                                                size="sm"
                                                                                color="red"
                                                                                variant="light"
                                                                                radius="xl"
                                                                            >
                                                                                Closed
                                                                            </Badge>
                                                                        </Group>

                                                                        <Text
                                                                            size="sm"
                                                                            c="dimmed"
                                                                            style={{
                                                                                wordBreak:
                                                                                    'break-word',
                                                                            }}
                                                                        >
                                                                            {
                                                                                blockedDate.reason
                                                                            }
                                                                        </Text>
                                                                    </Stack>
                                                                </Group>

                                                                <Button
                                                                    size="sm"
                                                                    radius="lg"
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
                                                    </motion.div>
                                                )
                                            },
                                        )}
                                    </Stack>
                                )}

                            </Stack>
                        </Card>
                    </motion.div>

                </Stack>
            </Container>

            {/* ====================================================== */}
            {/* BLOCK DATE MODAL */}
            {/* ====================================================== */}

            <Modal
                opened={modalOpened}
                onClose={
                    closeBlockModal
                }
                centered
                size="md"
                radius="xl"
                title={
                    <Stack gap={2}>
                        <Text
                            fw={800}
                            size="lg"
                        >
                            Block a date
                        </Text>

                        <Text
                            size="xs"
                            c="dimmed"
                        >
                            Add a temporary clinic
                            closure.
                        </Text>
                    </Stack>
                }
            >
                <Stack gap="xl">

                    <Card
                        radius="lg"
                        padding="md"
                        style={{
                            background:
                                'var(--mantine-color-red-0)',
                        }}
                    >
                        <Group
                            gap="sm"
                            align="flex-start"
                            wrap="nowrap"
                        >
                            <IconCalendarOff
                                size={20}
                                stroke={1.8}
                            />

                            <Text
                                size="sm"
                                style={{
                                    lineHeight: 1.6,
                                }}
                            >
                                Patients will not be able
                                to book appointments on
                                this date.
                            </Text>
                        </Group>
                    </Card>

                    <TextInput
                        label="Date"
                        description="Select a date from today onward."
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
                        description="This helps the clinic identify why the date is blocked."
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
                        <Card
                            withBorder
                            radius="lg"
                            padding="sm"
                            style={{
                                borderColor:
                                    'var(--mantine-color-red-3)',
                            }}
                        >
                            <Text
                                c="red"
                                size="sm"
                                fw={600}
                            >
                                {error}
                            </Text>
                        </Card>
                    )}

                    <Divider />

                    <Group
                        justify="flex-end"
                        gap="sm"
                    >
                        <Button
                            variant="subtle"
                            color="gray"
                            radius="lg"
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
                            radius="lg"
                            leftSection={
                                <IconCalendarOff
                                    size={17}
                                />
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

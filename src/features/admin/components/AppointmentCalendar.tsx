import React, {
    useEffect,
    useState,
} from 'react'

import {
    Box,
    Button,
    Center,
    Divider,
    Group,
    Paper,
    ScrollArea,
    SimpleGrid,
    Stack,
    Text,
} from '@mantine/core'

import {
    IconChevronLeft,
    IconChevronRight,
    IconClock,
} from '@tabler/icons-react'

import type { AdminAppointment } from '../services/appointmentAdminService'

import CalendarAppointmentCard from './CalendarAppointmentCard'

export type CalendarView =
    | 'month'
    | 'week'
    | 'day'

type AppointmentCalendarProps = {
    appointments: AdminAppointment[]
    currentDate: Date
    view: CalendarView
    onDateChange: (
        date: Date,
    ) => void
    onViewChange: (
        view: CalendarView,
    ) => void
    onAppointmentClick: (
        appointment: AdminAppointment,
    ) => void
    onMoreClick?: (
        date: Date,
        appointments: AdminAppointment[],
    ) => void
}

const DAY_NAMES = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
]

const MOBILE_DAY_NAMES = [
    'S',
    'M',
    'T',
    'W',
    'T',
    'F',
    'S',
]

const BASE_START_HOUR = 8
const BASE_END_HOUR = 18

// ============================================================
// MOBILE DETECTION
// ============================================================

function useIsMobile() {
    const getMatches =
        () =>
            typeof window !==
                'undefined' &&
            window.matchMedia(
                '(max-width: 767px)',
            ).matches

    const [isMobile, setIsMobile] =
        useState(getMatches)

    useEffect(() => {
        const mediaQuery =
            window.matchMedia(
                '(max-width: 767px)',
            )

        const handleChange =
            (
                event: MediaQueryListEvent,
            ) => {
                setIsMobile(
                    event.matches,
                )
            }

        setIsMobile(
            mediaQuery.matches,
        )

        mediaQuery.addEventListener(
            'change',
            handleChange,
        )

        return () => {
            mediaQuery.removeEventListener(
                'change',
                handleChange,
            )
        }
    }, [])

    return isMobile
}

// ============================================================
// DATE HELPERS
// ============================================================

function startOfDay(
    date: Date,
) {
    const result =
        new Date(date)

    result.setHours(
        0,
        0,
        0,
        0,
    )

    return result
}

function endOfDay(
    date: Date,
) {
    const result =
        new Date(date)

    result.setHours(
        23,
        59,
        59,
        999,
    )

    return result
}

function addDays(
    date: Date,
    amount: number,
) {
    const result =
        new Date(date)

    result.setDate(
        result.getDate() +
            amount,
    )

    return result
}

function startOfWeek(
    date: Date,
) {
    const result =
        startOfDay(date)

    result.setDate(
        result.getDate() -
            result.getDay(),
    )

    return result
}

function endOfWeek(
    date: Date,
) {
    return endOfDay(
        addDays(
            startOfWeek(date),
            6,
        ),
    )
}

function startOfMonth(
    date: Date,
) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        1,
    )
}

function endOfMonth(
    date: Date,
) {
    return new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
    )
}

function isSameDay(
    first: Date,
    second: Date,
) {
    return (
        first.getFullYear() ===
            second.getFullYear() &&
        first.getMonth() ===
            second.getMonth() &&
        first.getDate() ===
            second.getDate()
    )
}

/**
 * Always generates a local YYYY-MM-DD string.
 */
function toDateString(
    date: Date,
) {
    const year =
        date.getFullYear()

    const month =
        String(
            date.getMonth() + 1,
        ).padStart(2, '0')

    const day =
        String(
            date.getDate(),
        ).padStart(2, '0')

    return `${year}-${month}-${day}`
}

// ============================================================
// FORMAT HELPERS
// ============================================================

function formatMonthYear(
    date: Date,
) {
    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return 'Calendar'
    }

    return date.toLocaleDateString(
        'en-US',
        {
            month: 'long',
            year: 'numeric',
        },
    )
}

function formatFullDate(
    date: Date,
) {
    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return 'Date unavailable'
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

// ============================================================
// TIME HELPERS
// ============================================================

function formatHour(
    hour: number,
) {
    const date =
        new Date()

    date.setHours(
        hour,
        0,
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

function getHourFromTime(
    time: string,
) {
    const match =
        /^(\d{1,2})(?::(\d{2}))?/.exec(
            time.trim(),
        )

    if (!match) {
        return null
    }

    const hours =
        Number(match[1])

    if (
        Number.isNaN(hours) ||
        hours < 0 ||
        hours > 23
    ) {
        return null
    }

    return hours
}

// ============================================================
// APPOINTMENT HELPERS
// ============================================================

function getAppointmentsForDate(
    appointments: AdminAppointment[],
    date: Date,
) {
    const dateString =
        toDateString(date)

    return appointments
        .filter(
            (appointment) =>
                appointment.date.trim() ===
                dateString,
        )
        .sort(
            (a, b) =>
                a.time.localeCompare(
                    b.time,
                ),
        )
}

function getHoursForDates(
    appointments: AdminAppointment[],
    dates: Date[],
) {
    const relevantDates =
        new Set(
            dates.map(
                toDateString,
            ),
        )

    const relevantAppointments =
        appointments.filter(
            (appointment) =>
                relevantDates.has(
                    appointment.date.trim(),
                ),
        )

    const appointmentHours =
        relevantAppointments
            .map(
                (appointment) =>
                    getHourFromTime(
                        appointment.time,
                    ),
            )
            .filter(
                (
                    hour,
                ): hour is number =>
                    hour !== null,
            )

    const minAppointmentHour =
        appointmentHours.length > 0
            ? Math.min(
                  ...appointmentHours,
              )
            : BASE_START_HOUR

    const maxAppointmentHour =
        appointmentHours.length > 0
            ? Math.max(
                  ...appointmentHours,
              )
            : BASE_END_HOUR

    const startHour =
        Math.min(
            BASE_START_HOUR,
            minAppointmentHour,
        )

    const endHour =
        Math.max(
            BASE_END_HOUR,
            maxAppointmentHour,
        )

    return Array.from(
        {
            length:
                endHour -
                startHour +
                1,
        },
        (_, index) =>
            startHour + index,
    )
}

// ============================================================
// CALENDAR HEADER
// ============================================================

function CalendarHeader({
    currentDate,
    view,
    onDateChange,
    onViewChange,
}: {
    currentDate: Date
    view: CalendarView
    onDateChange: (
        date: Date,
    ) => void
    onViewChange: (
        view: CalendarView,
    ) => void
}) {
    const isMobile =
        useIsMobile()

    const goPrevious =
        () => {
            const next =
                new Date(
                    currentDate,
                )

            if (
                view ===
                'month'
            ) {
                next.setDate(1)

                next.setMonth(
                    next.getMonth() -
                        1,
                )
            } else if (
                view ===
                'week'
            ) {
                next.setDate(
                    next.getDate() -
                        7,
                )
            } else {
                next.setDate(
                    next.getDate() -
                        1,
                )
            }

            onDateChange(
                next,
            )
        }

    const goNext =
        () => {
            const next =
                new Date(
                    currentDate,
                )

            if (
                view ===
                'month'
            ) {
                next.setDate(1)

                next.setMonth(
                    next.getMonth() +
                        1,
                )
            } else if (
                view ===
                'week'
            ) {
                next.setDate(
                    next.getDate() +
                        7,
                )
            } else {
                next.setDate(
                    next.getDate() +
                        1,
                )
            }

            onDateChange(
                next,
            )
        }

    const goToday =
        () => {
            onDateChange(
                new Date(),
            )
        }

    let title = ''

    if (
        view ===
        'month'
    ) {
        title =
            formatMonthYear(
                currentDate,
            )
    } else if (
        view ===
        'week'
    ) {
        const start =
            startOfWeek(
                currentDate,
            )

        const end =
            addDays(
                start,
                6,
            )

        title = `${start.toLocaleDateString(
            'en-US',
            {
                month: 'short',
                day: 'numeric',
            },
        )} – ${end.toLocaleDateString(
            'en-US',
            {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            },
        )}`
    } else {
        title =
            formatFullDate(
                currentDate,
            )
    }

    return (
        <Stack
            gap={
                isMobile
                    ? 'sm'
                    : 'md'
            }
        >
            {/* TOP ROW */}

            <Group
                justify="space-between"
                align="center"
                wrap={
                    isMobile
                        ? 'wrap'
                        : 'nowrap'
                }
                gap="sm"
            >
                {/* NAVIGATION */}

                <Group gap="xs">
                    <Button
                        variant="subtle"
                        color="gray"
                        radius="md"
                        size={
                            isMobile
                                ? 'xs'
                                : 'sm'
                        }
                        onClick={
                            goToday
                        }
                    >
                        Today
                    </Button>

                    <Button
                        variant="default"
                        radius="md"
                        size={
                            isMobile
                                ? 'xs'
                                : 'sm'
                        }
                        px="xs"
                        onClick={
                            goPrevious
                        }
                        aria-label="Previous"
                    >
                        <IconChevronLeft
                            size={
                                isMobile
                                    ? 16
                                    : 17
                            }
                        />
                    </Button>

                    <Button
                        variant="default"
                        radius="md"
                        size={
                            isMobile
                                ? 'xs'
                                : 'sm'
                        }
                        px="xs"
                        onClick={
                            goNext
                        }
                        aria-label="Next"
                    >
                        <IconChevronRight
                            size={
                                isMobile
                                    ? 16
                                    : 17
                            }
                        />
                    </Button>
                </Group>

                {/* TITLE */}

                <Text
                    fw={800}
                    size={
                        isMobile
                            ? 'md'
                            : 'lg'
                    }
                    style={{
                        textAlign:
                            'center',
                        flex: isMobile
                            ? 1
                            : undefined,
                        minWidth: 0,
                    }}
                >
                    {title}
                </Text>
            </Group>

            {/* VIEW SWITCHER */}

            <Group
                gap={4}
                p={4}
                justify="center"
                style={{
                    width: '100%',
                    border:
                        '1px solid #E9E5DF',
                    borderRadius: 10,
                    background:
                        '#FAF8F5',
                }}
            >
                {(
                    [
                        'month',
                        'week',
                        'day',
                    ] as CalendarView[]
                ).map(
                    (
                        calendarView,
                    ) => {
                        const active =
                            view ===
                            calendarView

                        return (
                            <Button
                                key={
                                    calendarView
                                }
                                variant={
                                    active
                                        ? 'filled'
                                        : 'subtle'
                                }
                                color={
                                    active
                                        ? 'blue'
                                        : 'gray'
                                }
                                radius="md"
                                size={
                                    isMobile
                                        ? 'xs'
                                        : 'sm'
                                }
                                onClick={() =>
                                    onViewChange(
                                        calendarView,
                                    )
                                }
                                style={{
                                    flex: 1,
                                }}
                            >
                                {calendarView
                                    .charAt(
                                        0,
                                    )
                                    .toUpperCase() +
                                    calendarView.slice(
                                        1,
                                    )}
                            </Button>
                        )
                    },
                )}
            </Group>
        </Stack>
    )
}

// ============================================================
// MONTH VIEW - DESKTOP
// ============================================================

function DesktopMonthView({
    appointments,
    currentDate,
    onAppointmentClick,
    onMoreClick,
    onDateChange,
    onViewChange,
}: {
    appointments: AdminAppointment[]
    currentDate: Date
    onAppointmentClick: (
        appointment: AdminAppointment,
    ) => void
    onMoreClick?: (
        date: Date,
        appointments: AdminAppointment[],
    ) => void
    onDateChange: (
        date: Date,
    ) => void
    onViewChange: (
        view: CalendarView,
    ) => void
}) {
    const monthStart =
        startOfMonth(
            currentDate,
        )

    const monthEnd =
        endOfMonth(
            currentDate,
        )

    const gridStart =
        startOfWeek(
            monthStart,
        )

    const gridEnd =
        endOfWeek(
            monthEnd,
        )

    const totalDays =
        Math.round(
            (gridEnd.getTime() -
                gridStart.getTime()) /
                86400000,
        ) + 1

    const days =
        Array.from(
            {
                length:
                    totalDays,
            },
            (_, index) =>
                addDays(
                    gridStart,
                    index,
                ),
        )

    return (
        <Box>
            <SimpleGrid
                cols={7}
                spacing={0}
            >
                {DAY_NAMES.map(
                    (day) => (
                        <Box
                            key={day}
                            py="sm"
                            px="xs"
                            style={{
                                borderBottom:
                                    '1px solid #E9E5DF',
                                background:
                                    '#FAF8F5',
                            }}
                        >
                            <Text
                                size="xs"
                                fw={800}
                                c="dimmed"
                                ta="center"
                            >
                                {day}
                            </Text>
                        </Box>
                    ),
                )}

                {days.map(
                    (day) => {
                        const dayAppointments =
                            getAppointmentsForDate(
                                appointments,
                                day,
                            )

                        const isCurrentMonth =
                            day.getMonth() ===
                                currentDate.getMonth() &&
                            day.getFullYear() ===
                                currentDate.getFullYear()

                        const isToday =
                            isSameDay(
                                day,
                                new Date(),
                            )

                        const visibleAppointments =
                            dayAppointments.slice(
                                0,
                                3,
                            )

                        const overflowCount =
                            Math.max(
                                dayAppointments.length -
                                    3,
                                0,
                            )

                        return (
                            <Box
                                key={toDateString(
                                    day,
                                )}
                                p="xs"
                                onClick={() => {
                                    if (
                                        dayAppointments.length ===
                                        0
                                    ) {
                                        onDateChange(
                                            day,
                                        )

                                        onViewChange(
                                            'day',
                                        )
                                    }
                                }}
                                style={{
                                    minHeight: 145,
                                    borderRight:
                                        '1px solid #E9E5DF',
                                    borderBottom:
                                        '1px solid #E9E5DF',
                                    background:
                                        isCurrentMonth
                                            ? '#FFFFFF'
                                            : '#FAF8F5',
                                    cursor:
                                        dayAppointments.length ===
                                        0
                                            ? 'pointer'
                                            : 'default',
                                }}
                            >
                                <Group
                                    justify="space-between"
                                    mb="xs"
                                >
                                    <Text
                                        size="xs"
                                        fw={
                                            isToday
                                                ? 800
                                                : 600
                                        }
                                        c={
                                            isCurrentMonth
                                                ? 'dark'
                                                : 'dimmed'
                                        }
                                    >
                                        {day.getDate()}
                                    </Text>

                                    {isToday && (
                                        <Box
                                            w={6}
                                            h={6}
                                            style={{
                                                borderRadius:
                                                    '50%',
                                                background:
                                                    '#228BE6',
                                            }}
                                        />
                                    )}
                                </Group>

                                <Stack gap={4}>
                                    {visibleAppointments.map(
                                        (
                                            appointment,
                                        ) => (
                                            <CalendarAppointmentCard
                                                key={
                                                    appointment.id
                                                }
                                                appointment={
                                                    appointment
                                                }
                                                compact
                                                onClick={() =>
                                                    onAppointmentClick(
                                                        appointment,
                                                    )
                                                }
                                            />
                                        ),
                                    )}

                                    {overflowCount >
                                        0 && (
                                        <Button
                                            variant="subtle"
                                            color="blue"
                                            size="compact-xs"
                                            justify="flex-start"
                                            px={4}
                                            onClick={(
                                                event,
                                            ) => {
                                                event.stopPropagation()

                                                onMoreClick?.(
                                                    day,
                                                    dayAppointments,
                                                )
                                            }}
                                        >
                                            +
                                            {
                                                overflowCount
                                            }{' '}
                                            more
                                        </Button>
                                    )}
                                </Stack>
                            </Box>
                        )
                    },
                )}
            </SimpleGrid>
        </Box>
    )
}

// ============================================================
// MONTH VIEW - MOBILE
// ============================================================

function MobileMonthView({
    appointments,
    currentDate,
    onMoreClick,
    onDateChange,
    onViewChange,
}: {
    appointments: AdminAppointment[]
    currentDate: Date
    onAppointmentClick: (
        appointment: AdminAppointment,
    ) => void
    onMoreClick?: (
        date: Date,
        appointments: AdminAppointment[],
    ) => void
    onDateChange: (
        date: Date,
    ) => void
    onViewChange: (
        view: CalendarView,
    ) => void
}) {
    const monthStart =
        startOfMonth(
            currentDate,
        )

    const monthEnd =
        endOfMonth(
            currentDate,
        )

    const gridStart =
        startOfWeek(
            monthStart,
        )

    const gridEnd =
        endOfWeek(
            monthEnd,
        )

    const totalDays =
        Math.round(
            (gridEnd.getTime() -
                gridStart.getTime()) /
                86400000,
        ) + 1

    const days =
        Array.from(
            {
                length:
                    totalDays,
            },
            (_, index) =>
                addDays(
                    gridStart,
                    index,
                ),
        )

    return (
        <Box>
            {/* WEEKDAY HEADER */}

            <SimpleGrid
                cols={7}
                spacing={0}
            >
                {MOBILE_DAY_NAMES.map(
                    (day, index) => (
                        <Box
                            key={`${day}-${index}`}
                            py={8}
                            style={{
                                borderBottom:
                                    '1px solid #E9E5DF',
                                background:
                                    '#FAF8F5',
                            }}
                        >
                            <Text
                                size="xs"
                                fw={800}
                                c="dimmed"
                                ta="center"
                            >
                                {day}
                            </Text>
                        </Box>
                    ),
                )}

                {/* DAYS */}

                {days.map(
                    (day) => {
                        const dayAppointments =
                            getAppointmentsForDate(
                                appointments,
                                day,
                            )

                        const isCurrentMonth =
                            day.getMonth() ===
                                currentDate.getMonth() &&
                            day.getFullYear() ===
                                currentDate.getFullYear()

                        const isToday =
                            isSameDay(
                                day,
                                new Date(),
                            )

                        const hasAppointments =
                            dayAppointments.length >
                            0

                        return (
                            <Box
                                key={toDateString(
                                    day,
                                )}
                                onClick={() => {
                                    if (
                                        hasAppointments
                                    ) {
                                        onMoreClick?.(
                                            day,
                                            dayAppointments,
                                        )
                                    } else {
                                        onDateChange(
                                            day,
                                        )

                                        onViewChange(
                                            'day',
                                        )
                                    }
                                }}
                                style={{
                                    minHeight: 62,
                                    borderRight:
                                        '1px solid #E9E5DF',
                                    borderBottom:
                                        '1px solid #E9E5DF',
                                    background:
                                        isCurrentMonth
                                            ? '#FFFFFF'
                                            : '#FAF8F5',
                                    cursor: 'pointer',
                                    position:
                                        'relative',
                                }}
                            >
                                <Stack
                                    align="center"
                                    gap={3}
                                    py={7}
                                >
                                    {/* DATE */}

                                    <Box
                                        w={29}
                                        h={29}
                                        style={{
                                            borderRadius:
                                                '50%',
                                            display:
                                                'flex',
                                            alignItems:
                                                'center',
                                            justifyContent:
                                                'center',
                                            background:
                                                isToday
                                                    ? '#228BE6'
                                                    : 'transparent',
                                        }}
                                    >
                                        <Text
                                            size="xs"
                                            fw={
                                                isToday
                                                    ? 800
                                                    : 600
                                            }
                                            c={
                                                isToday
                                                    ? 'white'
                                                    : isCurrentMonth
                                                      ? 'dark'
                                                      : 'dimmed'
                                            }
                                        >
                                            {day.getDate()}
                                        </Text>
                                    </Box>

                                    {/* APPOINTMENT INDICATORS */}

                                    {hasAppointments ? (
                                        <Group
                                            gap={3}
                                            justify="center"
                                            wrap="nowrap"
                                        >
                                            {dayAppointments
                                                .slice(
                                                    0,
                                                    3,
                                                )
                                                .map(
                                                    (
                                                        appointment,
                                                    ) => (
                                                        <Box
                                                            key={
                                                                appointment.id
                                                            }
                                                            w={5}
                                                            h={5}
                                                            style={{
                                                                borderRadius:
                                                                    '50%',
                                                                background:
                                                                    '#228BE6',
                                                            }}
                                                        />
                                                    ),
                                                )}
                                        </Group>
                                    ) : (
                                        <Box
                                            h={5}
                                        />
                                    )}

                                    {dayAppointments.length >
                                        3 && (
                                        <Text
                                            size="8px"
                                            fw={700}
                                            c="blue"
                                            lh={1}
                                        >
                                            +
                                            {dayAppointments.length -
                                                3}
                                        </Text>
                                    )}
                                </Stack>
                            </Box>
                        )
                    },
                )}
            </SimpleGrid>

            {/* MOBILE LEGEND */}

            <Group
                justify="center"
                gap="xs"
                mt="sm"
            >
                <Box
                    w={6}
                    h={6}
                    style={{
                        borderRadius:
                            '50%',
                        background:
                            '#228BE6',
                    }}
                />

                <Text
                    size="xs"
                    c="dimmed"
                >
                    Tap a date to view
                    appointments
                </Text>
            </Group>
        </Box>
    )
}

// ============================================================
// WEEK VIEW
// ============================================================

function WeekView({
    appointments,
    currentDate,
    onAppointmentClick,
}: {
    appointments: AdminAppointment[]
    currentDate: Date
    onAppointmentClick: (
        appointment: AdminAppointment,
    ) => void
}) {
    const weekStart =
        startOfWeek(
            currentDate,
        )

    const weekDays =
        Array.from(
            {
                length: 7,
            },
            (_, index) =>
                addDays(
                    weekStart,
                    index,
                ),
        )

    const hours =
        getHoursForDates(
            appointments,
            weekDays,
        )

    return (
        <ScrollArea
            type="auto"
            offsetScrollbars
        >
            <Box
                style={{
                    minWidth: 900,
                }}
            >
                <SimpleGrid
                    cols={8}
                    spacing={0}
                >
                    {/* TIME HEADER */}

                    <Box
                        p="sm"
                        style={{
                            borderRight:
                                '1px solid #E9E5DF',
                            borderBottom:
                                '1px solid #E9E5DF',
                            background:
                                '#FAF8F5',
                        }}
                    >
                        <Text
                            size="xs"
                            fw={700}
                            c="dimmed"
                        >
                            Time
                        </Text>
                    </Box>

                    {/* DAY HEADERS */}

                    {weekDays.map(
                        (day) => {
                            const isToday =
                                isSameDay(
                                    day,
                                    new Date(),
                                )

                            return (
                                <Box
                                    key={toDateString(
                                        day,
                                    )}
                                    p="sm"
                                    ta="center"
                                    style={{
                                        borderBottom:
                                            '1px solid #E9E5DF',
                                        borderRight:
                                            '1px solid #E9E5DF',
                                        background:
                                            isToday
                                                ? '#F3F8FF'
                                                : '#FAF8F5',
                                    }}
                                >
                                    <Text
                                        size="xs"
                                        fw={700}
                                        c="dimmed"
                                    >
                                        {
                                            DAY_NAMES[
                                                day.getDay()
                                            ]
                                        }
                                    </Text>

                                    <Text
                                        size="sm"
                                        fw={
                                            isToday
                                                ? 800
                                                : 700
                                        }
                                        mt={2}
                                    >
                                        {
                                            day.getDate()
                                        }
                                    </Text>
                                </Box>
                            )
                        },
                    )}

                    {/* HOURS */}

                    {hours.map(
                        (hour) => (
                            <React.Fragment
                                key={hour}
                            >
                                {/* TIME */}

                                <Box
                                    p="xs"
                                    style={{
                                        minHeight: 90,
                                        borderRight:
                                            '1px solid #E9E5DF',
                                        borderBottom:
                                            '1px solid #E9E5DF',
                                        background:
                                            '#FAF8F5',
                                    }}
                                >
                                    <Group
                                        gap={4}
                                        wrap="nowrap"
                                    >
                                        <IconClock
                                            size={
                                                13
                                            }
                                            stroke={
                                                1.7
                                            }
                                        />

                                        <Text
                                            size="xs"
                                            c="dimmed"
                                            fw={600}
                                        >
                                            {formatHour(
                                                hour,
                                            )}
                                        </Text>
                                    </Group>
                                </Box>

                                {/* DAYS */}

                                {weekDays.map(
                                    (
                                        day,
                                    ) => {
                                        const hourAppointments =
                                            getAppointmentsForDate(
                                                appointments,
                                                day,
                                            ).filter(
                                                (
                                                    appointment,
                                                ) =>
                                                    getHourFromTime(
                                                        appointment.time,
                                                    ) ===
                                                    hour,
                                            )

                                        return (
                                            <Box
                                                key={`${toDateString(
                                                    day,
                                                )}-${hour}`}
                                                p={4}
                                                style={{
                                                    minHeight: 90,
                                                    borderRight:
                                                        '1px solid #E9E5DF',
                                                    borderBottom:
                                                        '1px solid #E9E5DF',
                                                    background:
                                                        '#FFFFFF',
                                                }}
                                            >
                                                <Stack
                                                    gap={4}
                                                >
                                                    {hourAppointments.map(
                                                        (
                                                            appointment,
                                                        ) => (
                                                            <CalendarAppointmentCard
                                                                key={
                                                                    appointment.id
                                                                }
                                                                appointment={
                                                                    appointment
                                                                }
                                                                compact
                                                                onClick={() =>
                                                                    onAppointmentClick(
                                                                        appointment,
                                                                    )
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </Stack>
                                            </Box>
                                        )
                                    },
                                )}
                            </React.Fragment>
                        ),
                    )}
                </SimpleGrid>
            </Box>
        </ScrollArea>
    )
}

// ============================================================
// DAY VIEW
// ============================================================

function DayView({
    appointments,
    currentDate,
    onAppointmentClick,
}: {
    appointments: AdminAppointment[]
    currentDate: Date
    onAppointmentClick: (
        appointment: AdminAppointment,
    ) => void
}) {
    const hours =
        getHoursForDates(
            appointments,
            [currentDate],
        )

    const dayAppointments =
        getAppointmentsForDate(
            appointments,
            currentDate,
        )

    return (
        <ScrollArea
            type="auto"
            offsetScrollbars
        >
            <Box
                style={{
                    minWidth: 0,
                }}
            >
                {/* DAY HEADER */}

                <Box
                    p="md"
                    style={{
                        borderBottom:
                            '1px solid #E9E5DF',
                        background:
                            '#FAF8F5',
                    }}
                >
                    <Text
                        size="sm"
                        fw={800}
                    >
                        {formatFullDate(
                            currentDate,
                        )}
                    </Text>

                    <Text
                        size="xs"
                        c="dimmed"
                        mt={2}
                    >
                        {
                            dayAppointments.length
                        }{' '}
                        appointment
                        {dayAppointments.length !==
                        1
                            ? 's'
                            : ''}
                    </Text>
                </Box>

                {/* HOURS */}

                {hours.map(
                    (hour) => {
                        const hourAppointments =
                            dayAppointments.filter(
                                (
                                    appointment,
                                ) =>
                                    getHourFromTime(
                                        appointment.time,
                                    ) ===
                                    hour,
                            )

                        return (
                            <Group
                                key={hour}
                                align="stretch"
                                wrap="nowrap"
                                gap={0}
                            >
                                {/* TIME */}

                                <Box
                                    w={95}
                                    p="sm"
                                    style={{
                                        flexShrink: 0,
                                        borderRight:
                                            '1px solid #E9E5DF',
                                        borderBottom:
                                            '1px solid #E9E5DF',
                                        background:
                                            '#FAF8F5',
                                    }}
                                >
                                    <Group
                                        gap={5}
                                        wrap="nowrap"
                                    >
                                        <IconClock
                                            size={
                                                14
                                            }
                                            stroke={
                                                1.7
                                            }
                                        />

                                        <Text
                                            size="xs"
                                            c="dimmed"
                                            fw={600}
                                        >
                                            {formatHour(
                                                hour,
                                            )}
                                        </Text>
                                    </Group>
                                </Box>

                                {/* APPOINTMENTS */}

                                <Box
                                    p="sm"
                                    style={{
                                        flex: 1,
                                        minWidth: 0,
                                        minHeight: 100,
                                        borderBottom:
                                            '1px solid #E9E5DF',
                                        background:
                                            '#FFFFFF',
                                    }}
                                >
                                    {hourAppointments.length >
                                    0 ? (
                                        <Stack
                                            gap="xs"
                                        >
                                            {hourAppointments.map(
                                                (
                                                    appointment,
                                                ) => (
                                                    <CalendarAppointmentCard
                                                        key={
                                                            appointment.id
                                                        }
                                                        appointment={
                                                            appointment
                                                        }
                                                        onClick={() =>
                                                            onAppointmentClick(
                                                                appointment,
                                                            )
                                                        }
                                                    />
                                                ),
                                            )}
                                        </Stack>
                                    ) : (
                                        <Center
                                            h="100%"
                                        >
                                            <Text
                                                size="xs"
                                                c="dimmed"
                                            >
                                                No
                                                appointments
                                            </Text>
                                        </Center>
                                    )}
                                </Box>
                            </Group>
                        )
                    },
                )}
            </Box>
        </ScrollArea>
    )
}

// ============================================================
// MAIN CALENDAR
// ============================================================

export default function AppointmentCalendar({
    appointments,
    currentDate,
    view,
    onDateChange,
    onViewChange,
    onAppointmentClick,
    onMoreClick,
}: AppointmentCalendarProps) {
    const isMobile =
        useIsMobile()

    return (
        <Paper
            radius="xl"
            withBorder
            style={{
                overflow: 'hidden',
                borderColor:
                    '#E9E5DF',
                background:
                    '#FFFFFF',
            }}
        >
            <Box
                p="md"
            >
                <CalendarHeader
                    currentDate={
                        currentDate
                    }
                    view={view}
                    onDateChange={
                        onDateChange
                    }
                    onViewChange={
                        onViewChange
                    }
                />

                <Divider
                    my="md"
                />

                {view ===
                    'month' &&
                    (isMobile ? (
                        <MobileMonthView
                            appointments={
                                appointments
                            }
                            currentDate={
                                currentDate
                            }
                            onAppointmentClick={
                                onAppointmentClick
                            }
                            onMoreClick={
                                onMoreClick
                            }
                            onDateChange={
                                onDateChange
                            }
                            onViewChange={
                                onViewChange
                            }
                        />
                    ) : (
                        <DesktopMonthView
                            appointments={
                                appointments
                            }
                            currentDate={
                                currentDate
                            }
                            onAppointmentClick={
                                onAppointmentClick
                            }
                            onMoreClick={
                                onMoreClick
                            }
                            onDateChange={
                                onDateChange
                            }
                            onViewChange={
                                onViewChange
                            }
                        />
                    ))}

                {view ===
                    'week' && (
                    <WeekView
                        appointments={
                            appointments
                        }
                        currentDate={
                            currentDate
                        }
                        onAppointmentClick={
                            onAppointmentClick
                        }
                    />
                )}

                {view ===
                    'day' && (
                    <DayView
                        appointments={
                            appointments
                        }
                        currentDate={
                            currentDate
                        }
                        onAppointmentClick={
                            onAppointmentClick
                        }
                    />
                )}
            </Box>
        </Paper>
    )
}
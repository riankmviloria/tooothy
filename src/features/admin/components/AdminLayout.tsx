import {
    ActionIcon,
    AppShell,
    Avatar,
    Badge,
    Box,
    Burger,
    Divider,
    Flex,
    Group,
    NavLink,
    ScrollArea,
    Stack,
    Text,
    UnstyledButton,
} from '@mantine/core'

import {
    IconCalendar,
    IconDental,
    IconLayoutDashboard,
    IconLogout,
    IconSettings,
} from '@tabler/icons-react'

import {
    Link,
    Outlet,
    useLocation,
    useNavigate,
} from 'react-router-dom'

import {
    signOut,
} from 'firebase/auth'

import {
    useDisclosure,
} from '@mantine/hooks'

import {
    auth,
} from '../../../lib/firebase'

import Brand from '../../../components/Brand'

function AdminLayout() {
    const [
        opened,
        {
            toggle,
            close,
        },
    ] = useDisclosure()

    const location =
        useLocation()

    const navigate =
        useNavigate()

    const handleLogout =
        async () => {
            try {
                await signOut(auth)

                navigate(
                    '/admin/login',
                    {
                        replace: true,
                    },
                )
            } catch (error) {
                console.error(
                    'Failed to logout:',
                    error,
                )
            }
        }

    const handleNavigation =
        () => {
            close()
        }

    const navigation = (
        <Stack gap={6}>

            {/* OVERVIEW */}

            <Text
                size="xs"
                fw={800}
                c="dimmed"
                tt="uppercase"
                style={{
                    letterSpacing:
                        '0.08em',
                    padding:
                        '0 12px',
                    marginBottom: 4,
                }}
            >
                Overview
            </Text>

            <NavLink
                component={Link}
                to="/admin"
                label="Dashboard"
                leftSection={
                    <IconLayoutDashboard
                        size={19}
                        stroke={1.8}
                    />
                }
                active={
                    location.pathname ===
                    '/admin'
                }
                onClick={
                    handleNavigation
                }
                styles={{
                    root: {
                        borderRadius: 12,
                        padding:
                            '11px 12px',
                        fontWeight: 600,
                    },
                    label: {
                        fontSize:
                            '0.92rem',
                    },
                }}
            />

            {/* MANAGEMENT */}

            <Text
                size="xs"
                fw={800}
                c="dimmed"
                tt="uppercase"
                style={{
                    letterSpacing:
                        '0.08em',
                    padding:
                        '0 12px',
                    marginTop: 18,
                    marginBottom: 4,
                }}
            >
                Management
            </Text>

            <NavLink
                component={Link}
                to="/admin/appointments"
                label="Appointments"
                leftSection={
                    <IconCalendar
                        size={19}
                        stroke={1.8}
                    />
                }
                active={
                    location.pathname.startsWith(
                        '/admin/appointments',
                    )
                }
                onClick={
                    handleNavigation
                }
                styles={{
                    root: {
                        borderRadius: 12,
                        padding:
                            '11px 12px',
                        fontWeight: 600,
                    },
                    label: {
                        fontSize:
                            '0.92rem',
                    },
                }}
            />

            <NavLink
                component={Link}
                to="/admin/services"
                label="Services"
                leftSection={
                    <IconDental
                        size={19}
                        stroke={1.8}
                    />
                }
                active={
                    location.pathname.startsWith(
                        '/admin/services',
                    )
                }
                onClick={
                    handleNavigation
                }
                styles={{
                    root: {
                        borderRadius: 12,
                        padding:
                            '11px 12px',
                        fontWeight: 600,
                    },
                    label: {
                        fontSize:
                            '0.92rem',
                    },
                }}
            />

            <NavLink
                component={Link}
                to="/admin/schedule"
                label="Schedule"
                leftSection={
                    <IconCalendar
                        size={19}
                        stroke={1.8}
                    />
                }
                active={
                    location.pathname.startsWith(
                        '/admin/schedule',
                    )
                }
                onClick={
                    handleNavigation
                }
                styles={{
                    root: {
                        borderRadius: 12,
                        padding:
                            '11px 12px',
                        fontWeight: 600,
                    },
                    label: {
                        fontSize:
                            '0.92rem',
                    },
                }}
            />

        </Stack>
    )

    const userEmail =
        auth.currentUser?.email ??
        'Admin'

    const userName =
        auth.currentUser?.displayName ??
        'Administrator'

    const userInitial =
        userName
            .charAt(0)
            .toUpperCase()

    return (
        <AppShell
            header={{
                height: 72,
            }}
            navbar={{
                width: 276,
                breakpoint: 'sm',
                collapsed: {
                    mobile: !opened,
                },
            }}
            padding={0}
        >

            {/* =====================================================
                HEADER
            ===================================================== */}

            <AppShell.Header
                style={{
                    background:
                        'rgba(255, 255, 255, 0.92)',
                    backdropFilter:
                        'blur(18px)',
                    WebkitBackdropFilter:
                        'blur(18px)',
                    borderBottom:
                        '1px solid var(--mantine-color-gray-2)',
                    boxShadow:
                        '0 4px 24px rgba(0, 0, 0, 0.03)',
                }}
            >
                <Flex
                    h="100%"
                    px="lg"
                    align="center"
                    justify="space-between"
                >

                    <Group
                        gap="md"
                    >
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="sm"
                            size="sm"
                            color="gray"
                        />

                        <Box
                            visibleFrom="sm"
                        >
                            <Brand compact />
                        </Box>

                        <Box
                            hiddenFrom="sm"
                        >
                            <Brand compact />
                        </Box>
                    </Group>

                    <Group
                        gap="sm"
                    >
                        <Badge
                            variant="light"
                            color="smilehaos"
                            radius="xl"
                            size="lg"
                            visibleFrom="sm"
                        >
                            Admin Portal
                        </Badge>

                        <Avatar
                            radius="xl"
                            size={38}
                            color="smilehaos"
                        >
                            {userInitial}
                        </Avatar>
                    </Group>

                </Flex>
            </AppShell.Header>

            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <AppShell.Navbar
                p={0}
                style={{
                    background:
                        '#ffffff',
                    borderRight:
                        '1px solid var(--mantine-color-gray-2)',
                }}
            >

                <AppShell.Section
                    grow
                    component={ScrollArea}
                    scrollbarSize={4}
                    p="md"
                >

                    {/* SIDEBAR BRAND */}

                    <Box
                        mb="xl"
                        px="xs"
                    >
                        <Group
                            gap="sm"
                        >
                            <ThemeIconPlaceholder />

                            <Stack
                                gap={0}
                            >
                                <Text
                                    fw={900}
                                    size="sm"
                                >
                                    Tooothy
                                </Text>

                                <Text
                                    size="xs"
                                    c="dimmed"
                                >
                                    Clinic administration
                                </Text>
                            </Stack>
                        </Group>
                    </Box>

                    {navigation}

                </AppShell.Section>

                {/* =================================================
                    USER AREA
                ================================================= */}

                <AppShell.Section
                    p="md"
                >

                    <Divider
                        mb="md"
                    />

                    <PaperUserCard
                        userName={
                            userName
                        }
                        userEmail={
                            userEmail
                        }
                        userInitial={
                            userInitial
                        }
                    />

                    {/* LOGOUT */}

                    <UnstyledButton
                        onClick={
                            handleLogout
                        }
                        style={{
                            width: '100%',
                            marginTop: 10,
                            padding:
                                '10px 12px',
                            borderRadius: 12,
                            transition:
                                'background 150ms ease',
                        }}
                        onMouseEnter={(
                            event,
                        ) => {
                            event.currentTarget.style.background =
                                'var(--mantine-color-gray-0)'
                        }}
                        onMouseLeave={(
                            event,
                        ) => {
                            event.currentTarget.style.background =
                                'transparent'
                        }}
                    >
                        <Group
                            gap="sm"
                        >
                            <ActionIcon
                                size={34}
                                radius="lg"
                                variant="light"
                                color="gray"
                                style={{
                                    pointerEvents:
                                        'none',
                                }}
                            >
                                <IconLogout
                                    size={17}
                                    stroke={1.8}
                                />
                            </ActionIcon>

                            <Text
                                size="sm"
                                fw={600}
                            >
                                Sign out
                            </Text>
                        </Group>
                    </UnstyledButton>

                </AppShell.Section>

            </AppShell.Navbar>

            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <AppShell.Main
                style={{
                    background:
                        '#FAF8F5',
                    minHeight:
                        '100vh',
                }}
            >
                <Outlet />
            </AppShell.Main>

        </AppShell>
    )
}

/* =============================================================
   SMALL ADMIN BRAND MARK
============================================================= */

function ThemeIconPlaceholder() {
    return (
        <Box
            style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background:
                    'var(--mantine-color-smilehaos-0)',
                border:
                    '1px solid var(--mantine-color-smilehaos-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color:
                    'var(--mantine-color-smilehaos-7)',
                fontSize: 20,
                fontWeight: 900,
                flexShrink: 0,
            }}
        >
            +
        </Box>
    )
}

/* =============================================================
   USER CARD
============================================================= */

type PaperUserCardProps = {
    userName: string
    userEmail: string
    userInitial: string
}

function PaperUserCard({
    userName,
    userEmail,
    userInitial,
}: PaperUserCardProps) {
    return (
        <Box
            style={{
                padding: 12,
                borderRadius: 16,
                background:
                    'var(--mantine-color-gray-0)',
                border:
                    '1px solid var(--mantine-color-gray-2)',
            }}
        >
            <Group
                gap="sm"
                wrap="nowrap"
            >
                <Avatar
                    radius="xl"
                    size={40}
                    color="smilehaos"
                    style={{
                        flexShrink: 0,
                    }}
                >
                    {userInitial}
                </Avatar>

                <Stack
                    gap={2}
                    style={{
                        minWidth: 0,
                        flex: 1,
                    }}
                >
                    <Group
                        gap="xs"
                        wrap="nowrap"
                    >
                        <Text
                            size="sm"
                            fw={700}
                            truncate
                        >
                            {userName}
                        </Text>

                        <Badge
                            size="xs"
                            radius="xl"
                            variant="light"
                            color="smilehaos"
                            style={{
                                flexShrink: 0,
                            }}
                        >
                            Admin
                        </Badge>
                    </Group>

                    <Text
                        size="xs"
                        c="dimmed"
                        truncate
                    >
                        {userEmail}
                    </Text>
                </Stack>

                <ActionIcon
                    component={Link}
                    to="/admin/settings"
                    variant="subtle"
                    color="gray"
                    size="md"
                    radius="lg"
                    aria-label="Settings"
                >
                    <IconSettings
                        size={17}
                        stroke={1.8}
                    />
                </ActionIcon>
            </Group>
        </Box>
    )
}

export default AdminLayout
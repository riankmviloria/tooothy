import {
    ActionIcon,
    AppShell,
    Avatar,
    Burger,
    Divider,
    Group,
    NavLink,
    ScrollArea,
    Stack,
    Text,
    UnstyledButton,
} from '@mantine/core'

import {
    IconCalendar,
    IconLayoutDashboard,
    IconLogout,
    IconSettings,
    IconDental,
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
    auth,
} from '../../../lib/firebase'

import {
    useDisclosure,
} from '@mantine/hooks'

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
        <Stack gap={4}>

            <NavLink
                component={Link}
                to="/admin"
                label="Dashboard"
                leftSection={
                    <IconLayoutDashboard
                        size={18}
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
            />

            <NavLink
                component={Link}
                to="/admin/appointments"
                label="Appointments"
                leftSection={
                    <IconCalendar
                        size={18}
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
            />

            <NavLink
                component={Link}
                to="/admin/services"
                label="Services"
                leftSection={
                    <IconDental
                        size={18}
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
            />

            <NavLink
                component={Link}
                to="/admin/schedule"
                label="Schedule"
                leftSection={
                    <IconCalendar
                        size={18}
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
            />

        </Stack>
    )

    const userEmail =
        auth.currentUser?.email ??
        'Admin'

    const userName =
        auth.currentUser?.displayName ??
        'Administrator'

    return (
        <AppShell
            header={{
                height: 64,
            }}
            navbar={{
                width: 260,
                breakpoint: 'sm',
                collapsed: {
                    mobile: !opened,
                },
            }}
            padding="md"
        >

            {/* HEADER */}

            <AppShell.Header>
                <Group
                    h="100%"
                    px="md"
                    justify="space-between"
                >

                    <Group
                        gap="sm"
                    >
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="sm"
                            size="sm"
                        />

                        <Brand
                            compact
                        />
                    </Group>

                </Group>
            </AppShell.Header>

            {/* SIDEBAR */}

            <AppShell.Navbar
                p="md"
            >
                <AppShell.Section
                    grow
                    component={ScrollArea}
                >
                    {navigation}
                </AppShell.Section>

                <AppShell.Section>

                    <Divider
                        mb="md"
                    />

                    <Group
                        justify="space-between"
                        wrap="nowrap"
                    >

                        {/* USER */}

                        <Group
                            gap="sm"
                            wrap="nowrap"
                            style={{
                                minWidth: 0,
                            }}
                        >

                            <Avatar
                                radius="xl"
                                size="sm"
                                color="smilehaos"
                            >
                                {userName
                                    .charAt(0)
                                    .toUpperCase()}
                            </Avatar>

                            <Stack
                                gap={0}
                                style={{
                                    minWidth: 0,
                                }}
                            >

                                <Text
                                    size="sm"
                                    fw={600}
                                    truncate
                                >
                                    {userName}
                                </Text>

                                <Text
                                    size="xs"
                                    c="dimmed"
                                    truncate
                                >
                                    {userEmail}
                                </Text>

                            </Stack>

                        </Group>

                        {/* SETTINGS */}

                        <ActionIcon
                            component={Link}
                            to="/admin/settings"
                            variant="subtle"
                            color="gray"
                            size="lg"
                            aria-label="Settings"
                        >
                            <IconSettings
                                size={18}
                                stroke={1.8}
                            />
                        </ActionIcon>

                    </Group>

                    {/* LOGOUT */}

                    <UnstyledButton
                        onClick={
                            handleLogout
                        }
                        style={{
                            width: '100%',
                            marginTop: 12,
                            padding: '8px 10px',
                            borderRadius: 8,
                        }}
                    >
                        <Group
                            gap="sm"
                        >
                            <IconLogout
                                size={18}
                                stroke={1.8}
                            />

                            <Text
                                size="sm"
                            >
                                Logout
                            </Text>
                        </Group>
                    </UnstyledButton>

                </AppShell.Section>

            </AppShell.Navbar>

            {/* MAIN CONTENT */}

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

export default AdminLayout
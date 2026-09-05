import {
    Alert,
    Box,
    Button,
    Card,
    Center,
    Container,
    Divider,
    Group,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    ThemeIcon,
    Title,
} from '@mantine/core'

import {
    IconAlertCircle,
    IconArrowRight,
    IconLock,
    IconShieldCheck,
} from '@tabler/icons-react'

import { useEffect, useState } from 'react'

import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
} from 'firebase/auth'

import {
    useNavigate,
} from 'react-router-dom'

import { auth } from '../lib/firebase'

function AdminLoginPage() {
    const navigate = useNavigate()

    const [email, setEmail] =
        useState('')

    const [password, setPassword] =
        useState('')

    const [loading, setLoading] =
        useState(false)

    const [checkingAuth, setCheckingAuth] =
        useState(true)

    const [error, setError] =
        useState<string | null>(null)

    /*
     * If the admin is already authenticated,
     * don't show the login page again.
     */
    useEffect(() => {
        const unsubscribe =
            onAuthStateChanged(
                auth,
                (user) => {
                    if (user) {
                        navigate(
                            '/admin',
                            {
                                replace: true,
                            },
                        )

                        return
                    }

                    setCheckingAuth(false)
                },
            )

        return unsubscribe
    }, [navigate])

    const handleLogin =
        async () => {
            if (loading) {
                return
            }

            const trimmedEmail =
                email.trim()

            if (!trimmedEmail) {
                setError(
                    'Please enter your email address.',
                )

                return
            }

            if (!password) {
                setError(
                    'Please enter your password.',
                )

                return
            }

            setLoading(true)
            setError(null)

            try {
                await signInWithEmailAndPassword(
                    auth,
                    trimmedEmail,
                    password,
                )

                navigate(
                    '/admin',
                    {
                        replace: true,
                    },
                )
            } catch (error) {
                console.error(
                    'Admin login failed:',
                    error,
                )

                if (
                    error &&
                    typeof error ===
                        'object' &&
                    'code' in error
                ) {
                    const code =
                        String(
                            (
                                error as {
                                    code: string
                                }
                            ).code,
                        )

                    switch (code) {
                        case 'auth/invalid-credential':
                        case 'auth/wrong-password':
                        case 'auth/user-not-found':
                            setError(
                                'Invalid email or password.',
                            )
                            break

                        case 'auth/invalid-email':
                            setError(
                                'Please enter a valid email address.',
                            )
                            break

                        case 'auth/user-disabled':
                            setError(
                                'This admin account has been disabled.',
                            )
                            break

                        case 'auth/too-many-requests':
                            setError(
                                'Too many login attempts. Please try again later.',
                            )
                            break

                        case 'auth/network-request-failed':
                            setError(
                                'Unable to connect. Please check your internet connection.',
                            )
                            break

                        default:
                            setError(
                                'Unable to sign you in. Please try again.',
                            )
                    }
                } else {
                    setError(
                        'Unable to sign you in. Please try again.',
                    )
                }
            } finally {
                setLoading(false)
            }
        }

    const handleKeyDown = (
        event: React.KeyboardEvent,
    ) => {
        if (
            event.key === 'Enter' &&
            !loading
        ) {
            handleLogin()
        }
    }

    if (checkingAuth) {
        return (
            <Center
                mih="100vh"
                bg="smilehaos.0"
            >
                <Stack
                    align="center"
                    gap="sm"
                >
                    <ThemeIcon
                        size={52}
                        radius="xl"
                        variant="light"
                        color="blue"
                    >
                        <IconShieldCheck
                            size={27}
                        />
                    </ThemeIcon>

                    <Text
                        size="sm"
                        c="dimmed"
                    >
                        Checking your session...
                    </Text>
                </Stack>
            </Center>
        )
    }

    return (
        <Center
            mih="100vh"
            bg="smilehaos.0"
            px="md"
            py={40}
        >
            <Container
                size={430}
                w="100%"
            >
                <Stack
                    align="center"
                    gap="xl"
                >
                    {/* BRAND */}
                    <Stack
                        align="center"
                        gap="sm"
                    >
                        <ThemeIcon
                            size={64}
                            radius="xl"
                            variant="gradient"
                            gradient={{
                                from: 'blue',
                                to: 'cyan',
                                deg: 135,
                            }}
                        >
                            <Text
                                size="2rem"
                                lh={1}
                            >
                                🦷
                            </Text>
                        </ThemeIcon>

                        <Stack
                            align="center"
                            gap={2}
                        >
                            <Title
                                order={1}
                                style={{
                                    letterSpacing:
                                        '-0.05em',
                                }}
                            >
                                SmileHaos
                            </Title>

                            <Text
                                size="sm"
                                c="dimmed"
                            >
                                Admin Portal
                            </Text>
                        </Stack>
                    </Stack>

                    {/* LOGIN CARD */}
                    <Card
                        withBorder
                        radius="xl"
                        p="xl"
                        w="100%"
                        shadow="sm"
                        style={{
                            borderColor:
                                '#E9E5DF',
                        }}
                    >
                        <Stack gap="lg">
                            {/* HEADER */}
                            <Group
                                gap="sm"
                                wrap="nowrap"
                            >
                                <ThemeIcon
                                    size={44}
                                    radius="md"
                                    variant="light"
                                    color="blue"
                                >
                                    <IconLock
                                        size={21}
                                        stroke={1.8}
                                    />
                                </ThemeIcon>

                                <Box>
                                    <Title
                                        order={2}
                                        size="1.45rem"
                                    >
                                        Welcome back
                                    </Title>

                                    <Text
                                        size="sm"
                                        c="dimmed"
                                        mt={2}
                                    >
                                        Sign in to manage
                                        your clinic.
                                    </Text>
                                </Box>
                            </Group>

                            <Divider />

                            {/* EMAIL */}
                            <TextInput
                                label="Email address"
                                placeholder="admin@example.com"
                                type="email"
                                value={email}
                                onChange={(
                                    event,
                                ) => {
                                    setEmail(
                                        event
                                            .currentTarget
                                            .value,
                                    )

                                    if (error) {
                                        setError(
                                            null,
                                        )
                                    }
                                }}
                                onKeyDown={
                                    handleKeyDown
                                }
                                autoComplete="email"
                                disabled={loading}
                                size="md"
                                radius="md"
                            />

                            {/* PASSWORD */}
                            <PasswordInput
                                label="Password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(
                                    event,
                                ) => {
                                    setPassword(
                                        event
                                            .currentTarget
                                            .value,
                                    )

                                    if (error) {
                                        setError(
                                            null,
                                        )
                                    }
                                }}
                                onKeyDown={
                                    handleKeyDown
                                }
                                autoComplete="current-password"
                                disabled={loading}
                                size="md"
                                radius="md"
                            />

                            {/* ERROR */}
                            {error && (
                                <Alert
                                    icon={
                                        <IconAlertCircle
                                            size={
                                                18
                                            }
                                        />
                                    }
                                    color="red"
                                    variant="light"
                                    radius="md"
                                >
                                    <Text
                                        size="sm"
                                    >
                                        {error}
                                    </Text>
                                </Alert>
                            )}

                            {/* LOGIN */}
                            <Button
                                size="md"
                                fullWidth
                                radius="md"
                                loading={loading}
                                rightSection={
                                    !loading ? (
                                        <IconArrowRight
                                            size={
                                                18
                                            }
                                        />
                                    ) : undefined
                                }
                                onClick={
                                    handleLogin
                                }
                            >
                                {loading
                                    ? 'Signing in...'
                                    : 'Sign in'}
                            </Button>

                            {/* SECURITY NOTE */}
                            <Group
                                justify="center"
                                gap={6}
                            >
                                <IconShieldCheck
                                    size={14}
                                    stroke={1.8}
                                />

                                <Text
                                    size="xs"
                                    c="dimmed"
                                >
                                    Secure admin access
                                </Text>
                            </Group>
                        </Stack>
                    </Card>

                    {/* FOOTER */}
                    <Stack
                        align="center"
                        gap={3}
                    >
                        <Text
                            size="xs"
                            c="dimmed"
                        >
                            Powered by Tooothy
                        </Text>

                        <Text
                            size="xs"
                            c="dimmed"
                            opacity={0.7}
                        >
                            Clinic administration portal
                        </Text>
                    </Stack>
                </Stack>
            </Container>
        </Center>
    )
}

export default AdminLoginPage
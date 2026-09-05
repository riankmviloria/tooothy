import {
    Button,
    Card,
    Center,
    Container,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core'
import { useState } from 'react'
import {
    signInWithEmailAndPassword,
} from 'firebase/auth'

import { auth } from '../lib/firebase'

function AdminLoginPage() {
    const [email, setEmail] =
        useState('')

    const [password, setPassword] =
        useState('')

    const [loading, setLoading] =
        useState(false)

    const [error, setError] =
        useState<string | null>(null)

    const handleLogin =
        async () => {
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

                window.location.href =
                    '/admin'
            } catch (error) {
                console.error(
                    'Admin login failed:',
                    error,
                )

                /*
                 * Firebase uses different error
                 * codes. We show a user-friendly
                 * message instead of exposing the
                 * Firebase error directly.
                 */
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

                        default:
                            setError(
                                `Unable to sign you in. (${code})`,
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

    return (
        <Center
            mih="100vh"
            bg="smilehaos.0"
            px="md"
        >
            <Container
                size={420}
                w="100%"
            >
                <Stack
                    align="center"
                    gap="xl"
                >
                    {/* BRAND */}
                    <Stack
                        align="center"
                        gap={4}
                    >
                        <Text size="2rem">
                            🦷
                        </Text>

                        <Title
                            order={1}
                            style={{
                                letterSpacing:
                                    '-0.04em',
                            }}
                        >
                            SmileHaos
                        </Title>

                        <Text
                            c="dimmed"
                            size="sm"
                        >
                            Admin Portal
                        </Text>
                    </Stack>

                    {/* LOGIN CARD */}
                    <Card
                        withBorder
                        radius="xl"
                        padding="xl"
                        w="100%"
                    >
                        <Stack gap="lg">
                            <Stack gap={4}>
                                <Title
                                    order={2}
                                    size="1.5rem"
                                >
                                    Welcome back
                                </Title>

                                <Text
                                    size="sm"
                                    c="dimmed"
                                >
                                    Sign in to manage
                                    your appointments.
                                </Text>
                            </Stack>

                            {/* EMAIL */}
                            <TextInput
                                label="Email"
                                placeholder="admin@example.com"
                                type="email"
                                value={email}
                                onChange={(
                                    event,
                                ) =>
                                    setEmail(
                                        event
                                            .currentTarget
                                            .value,
                                    )
                                }
                                onKeyDown={(
                                    event,
                                ) => {
                                    if (
                                        event.key ===
                                        'Enter'
                                    ) {
                                        handleLogin()
                                    }
                                }}
                                autoComplete="email"
                                disabled={loading}
                            />

                            {/* PASSWORD */}
                            <PasswordInput
                                label="Password"
                                placeholder="Your password"
                                value={password}
                                onChange={(
                                    event,
                                ) =>
                                    setPassword(
                                        event
                                            .currentTarget
                                            .value,
                                    )
                                }
                                onKeyDown={(
                                    event,
                                ) => {
                                    if (
                                        event.key ===
                                        'Enter'
                                    ) {
                                        handleLogin()
                                    }
                                }}
                                autoComplete="current-password"
                                disabled={loading}
                            />

                            {/* ERROR */}
                            {error && (
                                <Text
                                    c="red"
                                    size="sm"
                                    ta="center"
                                >
                                    {error}
                                </Text>
                            )}

                            {/* LOGIN */}
                            <Button
                                size="lg"
                                fullWidth
                                loading={loading}
                                onClick={
                                    handleLogin
                                }
                            >
                                Sign in
                            </Button>
                        </Stack>
                    </Card>

                    <Text
                        size="xs"
                        c="dimmed"
                    >
                        Powered by Tooothy
                    </Text>
                </Stack>
            </Container>
        </Center>
    )
}

export default AdminLoginPage
import {
    Alert,
    Button,
    Card,
    Container,
    Divider,
    Group,
    Loader,
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
    defaultNotificationSettings,
    getNotificationSettings,
    saveNotificationSettings,
    type NotificationSettings,
} from '../services/adminSettingsService'

function AdminSettingsPage() {
    const [
        settings,
        setSettings,
    ] = useState<NotificationSettings>(
        defaultNotificationSettings,
    )

    const [
        loading,
        setLoading,
    ] = useState(true)

    const [
        saving,
        setSaving,
    ] = useState(false)

    const [
        error,
        setError,
    ] = useState<string | null>(
        null,
    )

    const [
        success,
        setSuccess,
    ] = useState(false)

    useEffect(() => {
        const loadSettings =
            async () => {
                try {
                    const data =
                        await getNotificationSettings()

                    setSettings(data)
                } catch (error) {
                    console.error(
                        'Failed to load notification settings:',
                        error,
                    )

                    setError(
                        error instanceof Error
                            ? error.message
                            : 'Unable to load notification settings.',
                    )
                } finally {
                    setLoading(false)
                }
            }

        loadSettings()
    }, [])

    const updateSetting = <
        K extends keyof NotificationSettings
    >(
        key: K,
        value: NotificationSettings[K],
    ) => {
        setSettings(
            (current) => ({
                ...current,
                [key]: value,
            }),
        )

        setSuccess(false)
        setError(null)
    }

    const handleSave =
        async () => {
            setError(null)
            setSuccess(false)

            const adminEmail =
                settings.adminEmail.trim()

            if (!adminEmail) {
                setError(
                    'Please enter an admin notification email address.',
                )

                return
            }

            if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    adminEmail,
                )
            ) {
                setError(
                    'Please enter a valid email address.',
                )

                return
            }

            setSaving(true)

            try {
                await saveNotificationSettings({
                    ...settings,
                    adminEmail,
                })

                setSettings(
                    (current) => ({
                        ...current,
                        adminEmail,
                    }),
                )

                setSuccess(true)
            } catch (error) {
                console.error(
                    'Failed to save notification settings:',
                    error,
                )

                setError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to save notification settings.',
                )
            } finally {
                setSaving(false)
            }
        }

    if (loading) {
        return (
            <Container
                size="xl"
                py="md"
            >
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
                        Loading settings...
                    </Text>
                </Stack>
            </Container>
        )
    }

    return (
        <Container
            size="xl"
            py="md"
        >
            <Stack gap="xl">

                {/* HEADER */}

                <Stack gap={4}>
                    <Title
                        order={1}
                        style={{
                            letterSpacing:
                                '-0.04em',
                        }}
                    >
                        Settings
                    </Title>

                    <Text c="dimmed">
                        Manage clinic notification
                        preferences.
                    </Text>
                </Stack>

                {/* ALERTS */}

                {error && (
                    <Alert
                        color="red"
                        title="Unable to save settings"
                    >
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert
                        color="green"
                        title="Settings saved"
                    >
                        Your notification settings
                        have been updated successfully.
                    </Alert>
                )}

                {/* EMAIL NOTIFICATIONS */}

                <Card
                    withBorder
                    radius="xl"
                    padding="lg"
                >
                    <Stack gap="lg">

                        <Stack gap={2}>
                            <Title
                                order={2}
                                size="1.2rem"
                            >
                                Email notifications
                            </Title>

                            <Text
                                size="sm"
                                c="dimmed"
                            >
                                Configure where clinic
                                notifications are sent and
                                which appointment events
                                should trigger an email.
                            </Text>
                        </Stack>

                        <Divider />

                        <TextInput
                            label="Admin notification email"
                            description="New appointment notifications will be sent to this address."
                            placeholder="admin@example.com"
                            type="email"
                            value={
                                settings.adminEmail
                            }
                            onChange={(
                                event,
                            ) =>
                                updateSetting(
                                    'adminEmail',
                                    event
                                        .currentTarget
                                        .value,
                                )
                            }
                            required
                        />

                        <Stack gap="md">

                            <Text
                                fw={600}
                            >
                                Admin notifications
                            </Text>

                            <Switch
                                label="New appointment"
                                description="Notify the clinic when a patient submits a new appointment request."
                                checked={
                                    settings.notifyAdminOnNewAppointment
                                }
                                onChange={(
                                    event,
                                ) =>
                                    updateSetting(
                                        'notifyAdminOnNewAppointment',
                                        event
                                            .currentTarget
                                            .checked,
                                    )
                                }
                            />

                            <Switch
                                label="Appointment confirmed"
                                description="Notify the clinic when an appointment is confirmed."
                                checked={
                                    settings.notifyAdminOnConfirmed
                                }
                                onChange={(
                                    event,
                                ) =>
                                    updateSetting(
                                        'notifyAdminOnConfirmed',
                                        event
                                            .currentTarget
                                            .checked,
                                    )
                                }
                            />

                            <Switch
                                label="Appointment cancelled"
                                description="Notify the clinic when an appointment is cancelled."
                                checked={
                                    settings.notifyAdminOnCancelled
                                }
                                onChange={(
                                    event,
                                ) =>
                                    updateSetting(
                                        'notifyAdminOnCancelled',
                                        event
                                            .currentTarget
                                            .checked,
                                    )
                                }
                            />

                            <Switch
                                label="Appointment completed"
                                description="Notify the clinic when an appointment is marked as completed."
                                checked={
                                    settings.notifyAdminOnCompleted
                                }
                                onChange={(
                                    event,
                                ) =>
                                    updateSetting(
                                        'notifyAdminOnCompleted',
                                        event
                                            .currentTarget
                                            .checked,
                                    )
                                }
                            />

                        </Stack>

                        <Group
                            justify="flex-end"
                        >
                            <Button
                                loading={saving}
                                onClick={
                                    handleSave
                                }
                            >
                                Save settings
                            </Button>
                        </Group>

                    </Stack>
                </Card>

            </Stack>
        </Container>
    )
}

export default AdminSettingsPage
import {
    Badge,
    Button,
    Card,
    Container,
    Group,
    Loader,
    Modal,
    NumberInput,
    SimpleGrid,
    Stack,
    Switch,
    Text,
    Textarea,
    TextInput,
    Title,
} from '@mantine/core'
import {
    IconCheck,
    IconClock,
    IconEdit,
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
    addService,
    deleteService,
    subscribeToServices,
    updateService,
} from '../../services/data/serviceRepository'

import type {
    Service,
} from '../../services/types/service.types'

function AdminServicesPage() {
    const [
        services,
        setServices,
    ] = useState<Service[]>([])

    const [
        isLoading,
        setIsLoading,
    ] = useState(true)

    const [
        isModalOpen,
        setIsModalOpen,
    ] = useState(false)

    const [
        isDeleteModalOpen,
        setIsDeleteModalOpen,
    ] = useState(false)

    const [
        editingService,
        setEditingService,
    ] = useState<Service | null>(null)

    const [
        deletingService,
        setDeletingService,
    ] = useState<Service | null>(null)

    /*
     * FORM
     */

    const [
        name,
        setName,
    ] = useState('')

    const [
        description,
        setDescription,
    ] = useState('')

    const [
        duration,
        setDuration,
    ] = useState<number | string>(30)

    const [
        price,
        setPrice,
    ] = useState<number | string>(0)

    const [
        priceLabel,
        setPriceLabel,
    ] = useState('')

    const [
        icon,
        setIcon,
    ] = useState('🦷')

    const [
        isActive,
        setIsActive,
    ] = useState(true)

    /*
     * ACTION STATES
     */

    const [
        isSaving,
        setIsSaving,
    ] = useState(false)

    const [
        isDeleting,
        setIsDeleting,
    ] = useState(false)

    const [
        updatingServiceId,
        setUpdatingServiceId,
    ] = useState<string | null>(
        null,
    )

    /*
     * REALTIME SERVICES
     */

    useEffect(() => {
        const unsubscribe =
            subscribeToServices(
                (data) => {
                    setServices(data)
                    setIsLoading(false)
                },
                (error) => {
                    console.error(
                        'Failed to load services:',
                        error,
                    )

                    setIsLoading(false)
                },
            )

        return () => {
            unsubscribe()
        }
    }, [])

    /*
     * RESET FORM
     */

    const resetForm = () => {
        setName('')
        setDescription('')
        setDuration(30)
        setPrice(0)
        setPriceLabel('')
        setIcon('🦷')
        setIsActive(true)
        setEditingService(null)
    }

    /*
     * ADD
     */

    const handleAddService = () => {
        resetForm()
        setIsModalOpen(true)
    }

    /*
     * EDIT
     */

    const handleEditService = (
        service: Service,
    ) => {
        setEditingService(service)

        setName(
            service.name,
        )

        setDescription(
            service.description,
        )

        setDuration(
            service.duration,
        )

        setPrice(
            service.price,
        )

        setPriceLabel(
            service.priceLabel ??
                `₱${service.price.toLocaleString()}`,
        )

        setIcon(
            service.icon,
        )

        setIsActive(
            service.isActive,
        )

        setIsModalOpen(true)
    }

    /*
     * CLOSE
     */

    const handleCloseModal = () => {
        if (isSaving) {
            return
        }

        setIsModalOpen(false)
        resetForm()
    }

    /*
     * SAVE
     */

    const handleSaveService =
        async () => {
            const trimmedName =
                name.trim()

            const trimmedDescription =
                description.trim()

            const trimmedIcon =
                icon.trim()

            const trimmedPriceLabel =
                priceLabel.trim()

            if (!trimmedName) {
                return
            }

            if (
                !duration ||
                Number(duration) <= 0
            ) {
                return
            }

            if (
                price === '' ||
                Number(price) < 0
            ) {
                return
            }

            setIsSaving(true)

            try {
                const serviceData = {
                    name:
                        trimmedName,

                    description:
                        trimmedDescription,

                    duration:
                        Number(duration),

                    price:
                        Number(price),

                    priceLabel:
                        trimmedPriceLabel ||
                        `₱${Number(price).toLocaleString()}`,

                    icon:
                        trimmedIcon ||
                        '🦷',

                    isActive,
                }

                if (editingService) {
                    await updateService(
                        editingService.id,
                        serviceData,
                    )
                } else {
                    await addService(
                        serviceData,
                    )
                }

                setIsModalOpen(false)
                resetForm()
            } catch (error) {
                console.error(
                    'Failed to save service:',
                    error,
                )
            } finally {
                setIsSaving(false)
            }
        }

    /*
     * DELETE
     */

    const handleDeleteClick = (
        service: Service,
    ) => {
        setDeletingService(
            service,
        )

        setIsDeleteModalOpen(
            true,
        )
    }

    const handleCloseDeleteModal =
        () => {
            if (isDeleting) {
                return
            }

            setIsDeleteModalOpen(
                false,
            )

            setDeletingService(
                null,
            )
        }

    const handleDeleteService =
        async () => {
            if (!deletingService) {
                return
            }

            setIsDeleting(true)

            try {
                await deleteService(
                    deletingService.id,
                )

                setIsDeleteModalOpen(
                    false,
                )

                setDeletingService(
                    null,
                )
            } catch (error) {
                console.error(
                    'Failed to delete service:',
                    error,
                )
            } finally {
                setIsDeleting(false)
            }
        }

    /*
     * TOGGLE ACTIVE
     */

    const handleToggleActive =
        async (
            service: Service,
        ) => {
            setUpdatingServiceId(
                service.id,
            )

            try {
                await updateService(
                    service.id,
                    {
                        isActive:
                            !service.isActive,
                    },
                )
            } catch (error) {
                console.error(
                    'Failed to update service status:',
                    error,
                )
            } finally {
                setUpdatingServiceId(
                    null,
                )
            }
        }

    /*
     * SUMMARY
     */

    const activeServices =
        services.filter(
            (service) =>
                service.isActive,
        ).length

    const inactiveServices =
        services.length -
        activeServices

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
                                    Services
                                </Title>

                                <Text
                                    c="dimmed"
                                    size="sm"
                                    maw={620}
                                >
                                    Manage the dental
                                    services, pricing, and
                                    availability patients
                                    see when booking.
                                </Text>
                            </Stack>

                            <Button
                                size="md"
                                radius="lg"
                                leftSection={
                                    <IconPlus
                                        size={18}
                                    />
                                }
                                onClick={
                                    handleAddService
                                }
                            >
                                Add service
                            </Button>
                        </Group>
                    </motion.div>

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
                                            Total services
                                        </Text>

                                        <Text
                                            size="2rem"
                                            fw={800}
                                            lh={1}
                                        >
                                            {
                                                services.length
                                            }
                                        </Text>

                                        <Text
                                            size="xs"
                                            c="dimmed"
                                        >
                                            Services configured
                                        </Text>
                                    </Stack>

                                    <Badge
                                        variant="light"
                                        color="smilehaos"
                                        radius="xl"
                                    >
                                        Catalog
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
                                            Active
                                        </Text>

                                        <Text
                                            size="2rem"
                                            fw={800}
                                            lh={1}
                                        >
                                            {
                                                activeServices
                                            }
                                        </Text>

                                        <Text
                                            size="xs"
                                            c="dimmed"
                                        >
                                            Available for booking
                                        </Text>
                                    </Stack>

                                    <Badge
                                        color="green"
                                        variant="light"
                                        radius="xl"
                                    >
                                        Active
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
                                            Inactive
                                        </Text>

                                        <Text
                                            size="2rem"
                                            fw={800}
                                            lh={1}
                                        >
                                            {
                                                inactiveServices
                                            }
                                        </Text>

                                        <Text
                                            size="xs"
                                            c="dimmed"
                                        >
                                            Hidden from booking
                                        </Text>
                                    </Stack>

                                    <Badge
                                        color="gray"
                                        variant="light"
                                        radius="xl"
                                    >
                                        Inactive
                                    </Badge>
                                </Group>
                            </Card>
                        </motion.div>
                    </SimpleGrid>

                    {/* ================================================== */}
                    {/* SERVICES */}
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
                                                Service catalog
                                            </Title>

                                            <Badge
                                                variant="light"
                                                color="smilehaos"
                                                radius="xl"
                                            >
                                                {services.length}{' '}
                                                {services.length ===
                                                1
                                                    ? 'service'
                                                    : 'services'}
                                            </Badge>
                                        </Group>

                                        <Text
                                            size="sm"
                                            c="dimmed"
                                        >
                                            These are the
                                            services patients
                                            can select during
                                            appointment booking.
                                        </Text>
                                    </Stack>

                                    <Button
                                        variant="light"
                                        radius="lg"
                                        leftSection={
                                            <IconPlus
                                                size={17}
                                            />
                                        }
                                        onClick={
                                            handleAddService
                                        }
                                    >
                                        Add service
                                    </Button>
                                </Group>

                                {isLoading ? (
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
                                            Loading services...
                                        </Text>
                                    </Stack>
                                ) : services.length ===
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
                                            <Text
                                                size="2.5rem"
                                            >
                                                🦷
                                            </Text>

                                            <Text
                                                fw={700}
                                            >
                                                No services yet
                                            </Text>

                                            <Text
                                                size="sm"
                                                c="dimmed"
                                                ta="center"
                                                maw={420}
                                            >
                                                Add your first
                                                dental service
                                                to make it
                                                available for
                                                booking.
                                            </Text>

                                            <Button
                                                radius="lg"
                                                leftSection={
                                                    <IconPlus
                                                        size={
                                                            17
                                                        }
                                                    />
                                                }
                                                onClick={
                                                    handleAddService
                                                }
                                            >
                                                Add service
                                            </Button>
                                        </Stack>
                                    </Card>
                                ) : (
                                    <SimpleGrid
                                        cols={{
                                            base: 1,
                                            sm: 2,
                                            lg: 3,
                                        }}
                                        spacing="md"
                                    >
                                        {services.map(
                                            (
                                                service,
                                                index,
                                            ) => (
                                                <motion.div
                                                    key={
                                                        service.id
                                                    }
                                                    initial={{
                                                        opacity: 0,
                                                        y: 12,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        delay:
                                                            0.04 *
                                                            index,
                                                        duration:
                                                            0.3,
                                                    }}
                                                    style={{
                                                        height: '100%',
                                                    }}
                                                >
                                                    <Card
                                                        withBorder
                                                        radius="xl"
                                                        padding="lg"
                                                        style={{
                                                            height: '100%',
                                                            display:
                                                                'flex',
                                                            flexDirection:
                                                                'column',
                                                        }}
                                                    >
                                                        <Stack
                                                            gap="lg"
                                                            style={{
                                                                height: '100%',
                                                            }}
                                                        >

                                                            {/* SERVICE HEADER */}

                                                            <Group
                                                                justify="space-between"
                                                                align="flex-start"
                                                                gap="md"
                                                                wrap="nowrap"
                                                            >
                                                                <Card
                                                                    radius="lg"
                                                                    padding="md"
                                                                    style={{
                                                                        background:
                                                                            service.isActive
                                                                                ? 'var(--mantine-color-smilehaos-0)'
                                                                                : 'var(--mantine-color-gray-0)',
                                                                        flexShrink: 0,
                                                                    }}
                                                                >
                                                                    <Text
                                                                        size="1.8rem"
                                                                        lh={1}
                                                                    >
                                                                        {
                                                                            service.icon
                                                                        }
                                                                    </Text>
                                                                </Card>

                                                                <Badge
                                                                    color={
                                                                        service.isActive
                                                                            ? 'green'
                                                                            : 'gray'
                                                                    }
                                                                    variant="light"
                                                                    radius="xl"
                                                                >
                                                                    {service.isActive
                                                                        ? 'Active'
                                                                        : 'Inactive'}
                                                                </Badge>
                                                            </Group>

                                                            {/* SERVICE INFO */}

                                                            <Stack
                                                                gap={5}
                                                                style={{
                                                                    flex: 1,
                                                                }}
                                                            >
                                                                <Text
                                                                    fw={800}
                                                                    size="lg"
                                                                    style={{
                                                                        letterSpacing:
                                                                            '-0.02em',
                                                                    }}
                                                                >
                                                                    {
                                                                        service.name
                                                                    }
                                                                </Text>

                                                                <Text
                                                                    size="sm"
                                                                    c="dimmed"
                                                                    lineClamp={
                                                                        3
                                                                    }
                                                                    style={{
                                                                        lineHeight:
                                                                            1.6,
                                                                    }}
                                                                >
                                                                    {
                                                                        service.description
                                                                    }
                                                                </Text>
                                                            </Stack>

                                                            {/* SERVICE META */}

                                                            <Group
                                                                gap="xl"
                                                            >
                                                                <Group
                                                                    gap="xs"
                                                                    wrap="nowrap"
                                                                >
                                                                    <IconClock
                                                                        size={
                                                                            17
                                                                        }
                                                                        stroke={
                                                                            1.8
                                                                        }
                                                                    />

                                                                    <Stack
                                                                        gap={
                                                                            0
                                                                        }
                                                                    >
                                                                        <Text
                                                                            size="xs"
                                                                            c="dimmed"
                                                                        >
                                                                            Duration
                                                                        </Text>

                                                                        <Text
                                                                            size="sm"
                                                                            fw={
                                                                                700
                                                                            }
                                                                        >
                                                                            {
                                                                                service.duration
                                                                            }{' '}
                                                                            min
                                                                        </Text>
                                                                    </Stack>
                                                                </Group>

                                                                <Stack
                                                                    gap={
                                                                        0
                                                                    }
                                                                >
                                                                    <Text
                                                                        size="xs"
                                                                        c="dimmed"
                                                                    >
                                                                        Price
                                                                    </Text>

                                                                    <Text
                                                                        size="sm"
                                                                        fw={
                                                                            800
                                                                        }
                                                                    >
                                                                        {service.priceLabel ||
                                                                            `₱${service.price.toLocaleString()}`}
                                                                    </Text>
                                                                </Stack>
                                                            </Group>

                                                            {/* DIVIDER */}

                                                            <div
                                                                style={{
                                                                    height: 1,
                                                                    background:
                                                                        'var(--mantine-color-gray-2)',
                                                                }}
                                                            />

                                                            {/* ACTIONS */}

                                                            <Stack
                                                                gap="sm"
                                                            >
                                                                <Group
                                                                    justify="space-between"
                                                                    align="center"
                                                                >
                                                                    <Text
                                                                        size="xs"
                                                                        c="dimmed"
                                                                    >
                                                                        Booking
                                                                        availability
                                                                    </Text>

                                                                    <Switch
                                                                        size="sm"
                                                                        checked={
                                                                            service.isActive
                                                                        }
                                                                        onChange={() =>
                                                                            handleToggleActive(
                                                                                service,
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            updatingServiceId ===
                                                                            service.id
                                                                        }
                                                                    />
                                                                </Group>

                                                                <Group
                                                                    grow
                                                                    gap="sm"
                                                                >
                                                                    <Button
                                                                        size="sm"
                                                                        radius="lg"
                                                                        variant="light"
                                                                        leftSection={
                                                                            <IconEdit
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        }
                                                                        onClick={() =>
                                                                            handleEditService(
                                                                                service,
                                                                            )
                                                                        }
                                                                    >
                                                                        Edit
                                                                    </Button>

                                                                    <Button
                                                                        size="sm"
                                                                        radius="lg"
                                                                        variant="light"
                                                                        color="red"
                                                                        leftSection={
                                                                            <IconTrash
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        }
                                                                        onClick={() =>
                                                                            handleDeleteClick(
                                                                                service,
                                                                            )
                                                                        }
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                </Group>
                                                            </Stack>

                                                        </Stack>
                                                    </Card>
                                                </motion.div>
                                            ),
                                        )}
                                    </SimpleGrid>
                                )}

                            </Stack>
                        </Card>
                    </motion.div>

                </Stack>
            </Container>

            {/* ====================================================== */}
            {/* ADD / EDIT SERVICE MODAL */}
            {/* ====================================================== */}

            <Modal
                opened={isModalOpen}
                onClose={
                    handleCloseModal
                }
                centered
                size="lg"
                radius="xl"
                title={
                    <Stack gap={2}>
                        <Group gap="sm">
                            <Title
                                order={3}
                                size="1.2rem"
                            >
                                {editingService
                                    ? 'Edit service'
                                    : 'Add service'}
                            </Title>

                            <Badge
                                variant="light"
                                color="smilehaos"
                                radius="xl"
                            >
                                {editingService
                                    ? 'Update'
                                    : 'New'}
                            </Badge>
                        </Group>

                        <Text
                            size="xs"
                            c="dimmed"
                        >
                            Configure how this service
                            appears to patients.
                        </Text>
                    </Stack>
                }
            >
                <Stack gap="xl">

                    {/* SERVICE PREVIEW */}

                    <Card
                        radius="lg"
                        padding="lg"
                        style={{
                            background:
                                'var(--mantine-color-gray-0)',
                        }}
                    >
                        <Group
                            gap="md"
                            align="center"
                            wrap="nowrap"
                        >
                            <Card
                                radius="lg"
                                padding="md"
                                style={{
                                    background:
                                        'var(--mantine-color-smilehaos-0)',
                                    flexShrink: 0,
                                }}
                            >
                                <Text
                                    size="1.8rem"
                                    lh={1}
                                >
                                    {icon || '🦷'}
                                </Text>
                            </Card>

                            <Stack
                                gap={3}
                                style={{
                                    minWidth: 0,
                                }}
                            >
                                <Text
                                    size="xs"
                                    c="dimmed"
                                    fw={700}
                                    tt="uppercase"
                                    style={{
                                        letterSpacing:
                                            '0.07em',
                                    }}
                                >
                                    Patient preview
                                </Text>

                                <Text
                                    fw={750}
                                    size="sm"
                                    truncate
                                >
                                    {name ||
                                        'Service name'}
                                </Text>

                                <Text
                                    size="xs"
                                    c="dimmed"
                                >
                                    {priceLabel ||
                                        (Number(price) > 0
                                            ? `₱${Number(price).toLocaleString()}`
                                            : 'Price')}
                                    {' · '}
                                    {Number(duration) >
                                    0
                                        ? `${duration} min`
                                        : 'Duration'}
                                </Text>
                            </Stack>
                        </Group>
                    </Card>

                    {/* BASIC INFORMATION */}

                    <Stack gap="md">
                        <Text
                            size="xs"
                            fw={800}
                            c="dimmed"
                            tt="uppercase"
                            style={{
                                letterSpacing:
                                    '0.08em',
                            }}
                        >
                            Service information
                        </Text>

                        <TextInput
                            label="Service name"
                            placeholder="e.g. Dental Cleaning"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event
                                        .currentTarget
                                        .value,
                                )
                            }
                            required
                        />

                        <Textarea
                            label="Description"
                            placeholder="Describe the dental service..."
                            value={
                                description
                            }
                            onChange={(
                                event,
                            ) =>
                                setDescription(
                                    event
                                        .currentTarget
                                        .value,
                                )
                            }
                            autosize
                            minRows={3}
                        />
                    </Stack>

                    {/* PRICING */}

                    <Stack gap="md">
                        <Text
                            size="xs"
                            fw={800}
                            c="dimmed"
                            tt="uppercase"
                            style={{
                                letterSpacing:
                                    '0.08em',
                            }}
                        >
                            Pricing & duration
                        </Text>

                        <Group
                            grow
                            align="flex-start"
                            wrap="wrap"
                        >
                            <NumberInput
                                label="Duration"
                                placeholder="e.g. 30"
                                suffix=" min"
                                min={1}
                                value={
                                    duration
                                }
                                onChange={
                                    setDuration
                                }
                                required
                            />

                            <NumberInput
                                label="Starting price"
                                placeholder="e.g. 800"
                                prefix="₱ "
                                min={0}
                                thousandSeparator=","
                                value={
                                    price
                                }
                                onChange={
                                    setPrice
                                }
                                required
                            />
                        </Group>

                        <TextInput
                            label="Price display"
                            placeholder="e.g. From ₱800"
                            description="This is the price text patients will see."
                            value={
                                priceLabel
                            }
                            onChange={(
                                event,
                            ) =>
                                setPriceLabel(
                                    event
                                        .currentTarget
                                        .value,
                                )
                            }
                        />
                    </Stack>

                    {/* DISPLAY */}

                    <Stack gap="md">
                        <Text
                            size="xs"
                            fw={800}
                            c="dimmed"
                            tt="uppercase"
                            style={{
                                letterSpacing:
                                    '0.08em',
                            }}
                        >
                            Display settings
                        </Text>

                        <TextInput
                            label="Icon"
                            placeholder="🦷"
                            description="Use an emoji as the service icon."
                            value={icon}
                            onChange={(
                                event,
                            ) =>
                                setIcon(
                                    event
                                        .currentTarget
                                        .value,
                                )
                            }
                        />

                        <Card
                            withBorder
                            radius="lg"
                            padding="md"
                        >
                            <Group
                                justify="space-between"
                                align="center"
                                gap="md"
                            >
                                <Stack gap={3}>
                                    <Text
                                        fw={700}
                                        size="sm"
                                    >
                                        Available for
                                        booking
                                    </Text>

                                    <Text
                                        size="xs"
                                        c="dimmed"
                                        maw={420}
                                    >
                                        Active services
                                        appear in the
                                        patient booking
                                        flow.
                                    </Text>
                                </Stack>

                                <Switch
                                    checked={
                                        isActive
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        setIsActive(
                                            event
                                                .currentTarget
                                                .checked,
                                        )
                                    }
                                    label={
                                        isActive
                                            ? 'Active'
                                            : 'Inactive'
                                    }
                                />
                            </Group>
                        </Card>
                    </Stack>

                    {/* ACTIONS */}

                    <Group
                        justify="flex-end"
                        gap="sm"
                    >
                        <Button
                            variant="subtle"
                            color="gray"
                            radius="lg"
                            onClick={
                                handleCloseModal
                            }
                            disabled={
                                isSaving
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            radius="lg"
                            leftSection={
                                editingService ? (
                                    <IconCheck
                                        size={17}
                                    />
                                ) : (
                                    <IconPlus
                                        size={17}
                                    />
                                )
                            }
                            onClick={
                                handleSaveService
                            }
                            loading={
                                isSaving
                            }
                        >
                            {editingService
                                ? 'Save changes'
                                : 'Save service'}
                        </Button>
                    </Group>

                </Stack>
            </Modal>

            {/* ====================================================== */}
            {/* DELETE MODAL */}
            {/* ====================================================== */}

            <Modal
                opened={
                    isDeleteModalOpen
                }
                onClose={
                    handleCloseDeleteModal
                }
                centered
                size="sm"
                radius="xl"
                title={
                    <Group gap="sm">
                        <Badge
                            color="red"
                            variant="light"
                            radius="xl"
                        >
                            Delete
                        </Badge>

                        <Title
                            order={3}
                            size="1.1rem"
                        >
                            Delete service
                        </Title>
                    </Group>
                }
            >
                <Stack gap="xl">

                    <Card
                        radius="lg"
                        padding="lg"
                        style={{
                            background:
                                'var(--mantine-color-red-0)',
                        }}
                    >
                        <Stack gap="xs">
                            <Text
                                fw={700}
                            >
                                {deletingService?.name}
                            </Text>

                            <Text
                                size="sm"
                                c="dimmed"
                                style={{
                                    lineHeight: 1.6,
                                }}
                            >
                                Are you sure you want
                                to delete this service?
                                This action cannot be
                                undone.
                            </Text>
                        </Stack>
                    </Card>

                    <Group
                        justify="flex-end"
                        gap="sm"
                    >
                        <Button
                            variant="subtle"
                            color="gray"
                            radius="lg"
                            onClick={
                                handleCloseDeleteModal
                            }
                            disabled={
                                isDeleting
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            color="red"
                            radius="lg"
                            leftSection={
                                <IconTrash
                                    size={17}
                                />
                            }
                            onClick={
                                handleDeleteService
                            }
                            loading={
                                isDeleting
                            }
                        >
                            Delete service
                        </Button>
                    </Group>

                </Stack>
            </Modal>
        </>
    )
}

export default AdminServicesPage
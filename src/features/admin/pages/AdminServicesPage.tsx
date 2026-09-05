import {
    Badge,
    Button,
    Card,
    Container,
    Group,
    Modal,
    NumberInput,
    Stack,
    Switch,
    Table,
    Text,
    TextInput,
    Textarea,
    Title,
} from '@mantine/core'

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
    ] = useState<string | null>(null)


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

    const resetForm =
        () => {

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

    const handleAddService =
        () => {

            resetForm()

            setIsModalOpen(true)
        }


    /*
     * EDIT
     */

    const handleEditService =
        (service: Service) => {

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

    const handleCloseModal =
        () => {

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

    const handleDeleteClick =
        (service: Service) => {

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


    return (
        <>
            <Container
                size="xl"
                py="xl"
            >

                <Stack gap="xl">

                    {/* HEADER */}

                    <Group
                        justify="space-between"
                        align="center"
                    >

                        <Stack gap={4}>

                            <Title order={2}>
                                Services
                            </Title>

                            <Text
                                c="dimmed"
                                size="sm"
                            >
                                Manage the dental services
                                available for booking.
                            </Text>

                        </Stack>


                        <Button
                            onClick={
                                handleAddService
                            }
                        >
                            Add service
                        </Button>

                    </Group>


                    {/* TABLE */}

                    <Card
                        withBorder
                        radius="md"
                        padding={0}
                    >

                        {isLoading ? (

                            <Stack
                                align="center"
                                py="xl"
                            >
                                <Text c="dimmed">
                                    Loading services...
                                </Text>
                            </Stack>

                        ) : services.length === 0 ? (

                            <Stack
                                align="center"
                                py="xl"
                                px="md"
                            >

                                <Text fw={600}>
                                    No services yet
                                </Text>

                                <Text
                                    size="sm"
                                    c="dimmed"
                                    ta="center"
                                >
                                    Add your first dental
                                    service to make it
                                    available for booking.
                                </Text>

                                <Button
                                    onClick={
                                        handleAddService
                                    }
                                >
                                    Add service
                                </Button>

                            </Stack>

                        ) : (

                            <Table
                                striped
                                highlightOnHover
                                verticalSpacing="md"
                            >

                                <Table.Thead>

                                    <Table.Tr>

                                        <Table.Th>
                                            Service
                                        </Table.Th>

                                        <Table.Th>
                                            Duration
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

                                    {services.map(
                                        (service) => (

                                            <Table.Tr
                                                key={
                                                    service.id
                                                }
                                            >

                                                <Table.Td>

                                                    <Group gap="sm">

                                                        <Text size="xl">
                                                            {
                                                                service.icon
                                                            }
                                                        </Text>

                                                        <Stack gap={0}>

                                                            <Text fw={600}>
                                                                {
                                                                    service.name
                                                                }
                                                            </Text>

                                                            <Text
                                                                size="xs"
                                                                c="dimmed"
                                                            >
                                                                {
                                                                    service.description
                                                                }
                                                            </Text>

                                                        </Stack>

                                                    </Group>

                                                </Table.Td>


                                                <Table.Td>
                                                    {
                                                        service.duration
                                                    }{' '}
                                                    min
                                                </Table.Td>


                                                <Table.Td>
                                                    {
                                                        service.priceLabel ||
                                                        `₱${service.price.toLocaleString()}`
                                                    }
                                                </Table.Td>


                                                <Table.Td>

                                                    <Switch
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
                                                        label={
                                                            <Badge
                                                                color={
                                                                    service.isActive
                                                                        ? 'green'
                                                                        : 'gray'
                                                                }
                                                                variant="light"
                                                            >
                                                                {
                                                                    service.isActive
                                                                        ? 'Active'
                                                                        : 'Inactive'
                                                                }
                                                            </Badge>
                                                        }
                                                    />

                                                </Table.Td>


                                                <Table.Td>

                                                    <Group gap="xs">

                                                        <Button
                                                            size="xs"
                                                            variant="light"
                                                            onClick={() =>
                                                                handleEditService(
                                                                    service,
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </Button>


                                                        <Button
                                                            size="xs"
                                                            variant="subtle"
                                                            color="red"
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    service,
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </Button>

                                                    </Group>

                                                </Table.Td>

                                            </Table.Tr>

                                        ),
                                    )}

                                </Table.Tbody>

                            </Table>

                        )}

                    </Card>

                </Stack>

            </Container>


            {/* ADD / EDIT MODAL */}

            <Modal
                opened={isModalOpen}
                onClose={
                    handleCloseModal
                }
                title={
                    editingService
                        ? 'Edit Service'
                        : 'Add Service'
                }
                centered
            >

                <Stack gap="md">

                    <TextInput
                        label="Service name"
                        placeholder="e.g. Dental Cleaning"
                        value={name}
                        onChange={(event) =>
                            setName(
                                event.currentTarget.value,
                            )
                        }
                        required
                    />


                    <Textarea
                        label="Description"
                        placeholder="Describe the dental service..."
                        value={description}
                        onChange={(event) =>
                            setDescription(
                                event.currentTarget.value,
                            )
                        }
                        autosize
                        minRows={3}
                    />


                    <NumberInput
                        label="Duration"
                        placeholder="e.g. 30"
                        suffix=" min"
                        min={1}
                        value={duration}
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
                        value={price}
                        onChange={
                            setPrice
                        }
                        required
                    />


                    <TextInput
                        label="Price display"
                        placeholder="e.g. From ₱800"
                        description="This is what patients will see."
                        value={priceLabel}
                        onChange={(event) =>
                            setPriceLabel(
                                event.currentTarget.value,
                            )
                        }
                    />


                    <TextInput
                        label="Icon"
                        placeholder="🦷"
                        description="Use an emoji as the service icon."
                        value={icon}
                        onChange={(event) =>
                            setIcon(
                                event.currentTarget.value,
                            )
                        }
                    />


                    <Switch
                        label="Active"
                        description="Active services are available for patient booking."
                        checked={isActive}
                        onChange={(event) =>
                            setIsActive(
                                event.currentTarget.checked,
                            )
                        }
                    />


                    <Group
                        justify="flex-end"
                        mt="md"
                    >

                        <Button
                            variant="default"
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
                            onClick={
                                handleSaveService
                            }
                            loading={
                                isSaving
                            }
                        >
                            {
                                editingService
                                    ? 'Save changes'
                                    : 'Save service'
                            }
                        </Button>

                    </Group>

                </Stack>

            </Modal>


            {/* DELETE MODAL */}

            <Modal
                opened={
                    isDeleteModalOpen
                }
                onClose={
                    handleCloseDeleteModal
                }
                title="Delete Service"
                centered
            >

                <Stack gap="md">

                    <Text>
                        Are you sure you want to
                        delete{' '}

                        <Text
                            component="span"
                            fw={700}
                        >
                            {
                                deletingService?.name
                            }
                        </Text>
                        ?
                    </Text>


                    <Text
                        size="sm"
                        c="dimmed"
                    >
                        This action cannot be undone.
                    </Text>


                    <Group
                        justify="flex-end"
                        mt="md"
                    >

                        <Button
                            variant="default"
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
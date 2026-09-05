import {
    Anchor,
    Box,
    Container,
    Divider,
    Flex,
    Group,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core'

import {
    IconClock,
    IconMapPin,
    IconPhone,
    IconSparkles,
} from '@tabler/icons-react'

function Footer() {
    const currentYear =
        new Date().getFullYear()

    return (
        <footer>
            <Box
                mt={80}
                style={{
                    background:
                        'linear-gradient(180deg, var(--mantine-color-smilehaos-0) 0%, #ffffff 100%)',
                    borderTop:
                        '1px solid var(--mantine-color-gray-2)',
                }}
            >
                <Container
                    size="lg"
                    py="xl"
                >
                    <Stack gap="xl">

                        {/* =====================================================
                            MAIN FOOTER CARD
                        ===================================================== */}

                        <Paper
                            radius={32}
                            p="xl"
                            withBorder
                            style={{
                                position:
                                    'relative',
                                overflow:
                                    'hidden',
                                background:
                                    '#ffffff',
                                borderColor:
                                    'var(--mantine-color-gray-2)',
                                boxShadow:
                                    '0 25px 80px rgba(0, 0, 0, 0.07)',
                            }}
                        >

                            {/* Decorative glow */}

                            <Box
                                style={{
                                    position:
                                        'absolute',
                                    width: 260,
                                    height: 260,
                                    borderRadius:
                                        '50%',
                                    background:
                                        'var(--mantine-color-smilehaos-0)',
                                    right: -140,
                                    top: -150,
                                    pointerEvents:
                                        'none',
                                }}
                            />

                            <Box
                                style={{
                                    position:
                                        'absolute',
                                    width: 160,
                                    height: 160,
                                    borderRadius:
                                        '50%',
                                    background:
                                        'var(--mantine-color-smilehaos-1)',
                                    left: -100,
                                    bottom: -100,
                                    pointerEvents:
                                        'none',
                                }}
                            />

                            <Stack
                                gap="xl"
                                style={{
                                    position:
                                        'relative',
                                    zIndex: 1,
                                }}
                            >

                                {/* =================================================
                                    BRAND + CTA
                                ================================================= */}

                                <Flex
                                    direction={{
                                        base: 'column',
                                        sm: 'row',
                                    }}
                                    justify="space-between"
                                    align={{
                                        base: 'flex-start',
                                        sm: 'center',
                                    }}
                                    gap="xl"
                                >

                                    <Stack
                                        gap="xs"
                                        maw={520}
                                    >
                                        <Group
                                            gap="sm"
                                        >
                                            <ThemeIcon
                                                size={48}
                                                radius="xl"
                                                color="smilehaos"
                                                variant="light"
                                            >
                                                <IconSparkles
                                                    size={24}
                                                />
                                            </ThemeIcon>

                                            <Stack
                                                gap={0}
                                            >
                                                <Title
                                                    order={2}
                                                    size="1.7rem"
                                                    style={{
                                                        letterSpacing:
                                                            '-0.04em',
                                                    }}
                                                >
                                                    SmileHaos
                                                </Title>

                                                <Text
                                                    size="xs"
                                                    fw={700}
                                                    c="smilehaos.6"
                                                    tt="uppercase"
                                                    style={{
                                                        letterSpacing:
                                                            '0.12em',
                                                    }}
                                                >
                                                    Dental Clinic
                                                </Text>
                                            </Stack>
                                        </Group>

                                        <Text
                                            size="md"
                                            c="dimmed"
                                            lh={1.6}
                                            maw={480}
                                        >
                                            Comfortable,
                                            personalized dental
                                            care for you and your
                                            family in Iba,
                                            Zambales.
                                        </Text>
                                    </Stack>

                                </Flex>

                                <Divider />

                                {/* =================================================
                                    INFORMATION
                                ================================================= */}

                                <SimpleGrid
                                    cols={{
                                        base: 1,
                                        sm: 3,
                                    }}
                                    spacing="md"
                                >

                                    {/* Location */}

                                    <Paper
                                        radius="xl"
                                        p="lg"
                                        withBorder
                                        style={{
                                            background:
                                                'var(--mantine-color-gray-0)',
                                            borderColor:
                                                'var(--mantine-color-gray-2)',
                                        }}
                                    >
                                        <Group
                                            align="flex-start"
                                            wrap="nowrap"
                                        >
                                            <ThemeIcon
                                                size={42}
                                                radius="lg"
                                                color="smilehaos"
                                                variant="light"
                                            >
                                                <IconMapPin
                                                    size={21}
                                                />
                                            </ThemeIcon>

                                            <Stack
                                                gap={4}
                                            >
                                                <Text
                                                    size="xs"
                                                    fw={800}
                                                    tt="uppercase"
                                                    c="dimmed"
                                                    style={{
                                                        letterSpacing:
                                                            '0.08em',
                                                    }}
                                                >
                                                    Location
                                                </Text>

                                                <Anchor
                                                    href="https://www.google.com/maps/dir/15.3544424,119.9624897/Smile+Hao's+Dental+Clinic,+303+3rd+Floor,+Palanginan+Landmark:+Front+of+LTO,+JRM+Building,+Iba,+2201+Zambales/@15.3339256,119.9583576,14z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x339425a04ffe9973:0x50f9336a1bfd4637!2m2!1d119.9953599!2d15.313043?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    size="sm"
                                                    fw={600}
                                                    underline="hover"
                                                >
                                                    JRM Bldg, Unit 303
                                                    G-916 Palanginan
                                                </Anchor>

                                                <Text
                                                    size="xs"
                                                    c="dimmed"
                                                >
                                                    Iba, Zambales
                                                    <br />
                                                    In front of LTO
                                                </Text>
                                            </Stack>
                                        </Group>
                                    </Paper>

                                    {/* Hours */}

                                    <Paper
                                        radius="xl"
                                        p="lg"
                                        withBorder
                                        style={{
                                            background:
                                                'var(--mantine-color-gray-0)',
                                            borderColor:
                                                'var(--mantine-color-gray-2)',
                                        }}
                                    >
                                        <Group
                                            align="flex-start"
                                            wrap="nowrap"
                                        >
                                            <ThemeIcon
                                                size={42}
                                                radius="lg"
                                                color="smilehaos"
                                                variant="light"
                                            >
                                                <IconClock
                                                    size={21}
                                                />
                                            </ThemeIcon>

                                            <Stack
                                                gap={4}
                                            >
                                                <Text
                                                    size="xs"
                                                    fw={800}
                                                    tt="uppercase"
                                                    c="dimmed"
                                                    style={{
                                                        letterSpacing:
                                                            '0.08em',
                                                    }}
                                                >
                                                    Clinic Hours
                                                </Text>

                                                <Text
                                                    size="sm"
                                                    fw={700}
                                                >
                                                    10:00 AM – 5:00 PM
                                                </Text>

                                                <Text
                                                    size="xs"
                                                    c="dimmed"
                                                >
                                                    Monday to Sunday
                                                </Text>
                                            </Stack>
                                        </Group>
                                    </Paper>

                                    {/* Contact */}

                                    <Paper
                                        radius="xl"
                                        p="lg"
                                        withBorder
                                        style={{
                                            background:
                                                'var(--mantine-color-gray-0)',
                                            borderColor:
                                                'var(--mantine-color-gray-2)',
                                        }}
                                    >
                                        <Group
                                            align="flex-start"
                                            wrap="nowrap"
                                        >
                                            <ThemeIcon
                                                size={42}
                                                radius="lg"
                                                color="smilehaos"
                                                variant="light"
                                            >
                                                <IconPhone
                                                    size={21}
                                                />
                                            </ThemeIcon>

                                            <Stack
                                                gap={4}
                                            >
                                                <Text
                                                    size="xs"
                                                    fw={800}
                                                    tt="uppercase"
                                                    c="dimmed"
                                                    style={{
                                                        letterSpacing:
                                                            '0.08em',
                                                    }}
                                                >
                                                    Contact
                                                </Text>

                                                <Anchor
                                                    href="tel:09272393075"
                                                    size="sm"
                                                    fw={700}
                                                >
                                                    +63 927 239 3075
                                                </Anchor>

                                                <Text
                                                    size="xs"
                                                    c="dimmed"
                                                >
                                                    Call the clinic
                                                    directly
                                                </Text>
                                            </Stack>
                                        </Group>
                                    </Paper>

                                </SimpleGrid>
                            </Stack>
                        </Paper>

                        {/* =====================================================
                            BOTTOM BAR
                        ===================================================== */}

                        <Flex
                            direction={{
                                base: 'column',
                                sm: 'row',
                            }}
                            justify="space-between"
                            align={{
                                base: 'flex-start',
                                sm: 'center',
                            }}
                            gap="sm"
                        >
                            <Text
                                size="xs"
                                c="dimmed"
                            >
                                © {currentYear} SmileHaos
                                Dental Clinic. All rights
                                reserved.
                            </Text>

                            <Group
                                gap={6}
                            >
                                <Text
                                    size="xs"
                                    c="dimmed"
                                >
                                    Made with
                                </Text>

                                <Text
                                    size="xs"
                                >
                                    🦷
                                </Text>

                                <Text
                                    size="xs"
                                    fw={800}
                                    c="smilehaos.6"
                                >
                                    Tooothy
                                </Text>
                            </Group>
                        </Flex>

                    </Stack>
                </Container>
            </Box>
        </footer>
    )
}

export default Footer
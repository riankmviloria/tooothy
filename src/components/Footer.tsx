import {
    Box,
    Container,
    Divider,
    Flex,
    Group,
    Stack,
    Text,
    Title,
} from '@mantine/core'

function Footer() {
    return (
        <footer>
            <Box
                mt={60}
                style={{
                    background:
                        'var(--mantine-color-smilehaos-0)',
                }}
            >
                <Container
                    size="lg"
                    py={{
                        base: 45,
                        sm: 55,
                        md: 65,
                    }}
                >
                    <Flex
                        direction={{
                            base: 'column',
                            md: 'row',
                        }}
                        justify="space-between"
                        align={{
                            base: 'flex-start',
                            md: 'flex-start',
                        }}
                        gap={{
                            base: 35,
                            md: 80,
                        }}
                    >
                        {/* Brand */}
                        <Stack
                            gap={6}
                            maw={400}
                        >
                            <Title
                                order={3}
                                size="h3"
                                style={{
                                    letterSpacing: '-0.03em',
                                }}
                            >
                                SmileHaos
                            </Title>

                            <Text
                                size="sm"
                                c="dimmed"
                                lh={1.6}
                            >
                                Comfortable, personalized dental care
                                for you and your family in Iba, Zambales.
                            </Text>

                            <Text
                                size="sm"
                                fw={600}
                                c="smilehaos.6"
                            >
                                SmileHaos Dental Clinic
                            </Text>
                        </Stack>

                        {/* Clinic Information */}
                        <Stack
                            gap="sm"
                            maw={420}
                        >
                            <Text
                                size="sm"
                                fw={700}
                            >
                                Clinic Information
                            </Text>

                            <Stack gap={6}>
                                <Text
                                    size="sm"
                                    c="dimmed"
                                    lh={1.5}
                                >
                                    <Text
                                        component="span"
                                        fw={600}
                                        c="dark"
                                    >
                                        Address:{' '}
                                    </Text>

                                    <Text
                                        component="a"
                                        href="https://www.google.com/maps/dir/15.3544424,119.9624897/Smile+Hao's+Dental+Clinic,+303+3rd+Floor,+Palanginan+Landmark:+Front+of+LTO,+JRM+Building,+Iba,+2201+Zambales/@15.3339256,119.9583576,14z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x339425a04ffe9973:0x50f9336a1bfd4637!2m2!1d119.9953599!2d15.313043?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        inherit
                                        style={{
                                            textDecoration: 'none',
                                        }}
                                    >
                                        JRM Bldg, Unit 303 G-916 Palanginan,
                                        Iba, Zambales
                                        <br />
                                        In front of LTO
                                    </Text>
                                </Text>

                                <Text
                                    size="xs"
                                    c="smilehaos.6"
                                    fw={600}
                                >
                                    📍 Get directions on Google Maps
                                </Text>

                                <Text
                                    size="sm"
                                    c="dimmed"
                                >
                                    <Text
                                        component="span"
                                        fw={600}
                                        c="dark"
                                    >
                                        Hours:{' '}
                                    </Text>
                                    9:00 AM – 6:00 PM, Monday to Sunday
                                </Text>

                                <Text
                                    component="a"
                                    href="tel:09272393075"
                                    size="sm"
                                    c="smilehaos.6"
                                    fw={600}
                                    style={{
                                        textDecoration: 'none',
                                    }}
                                >
                                    +63 927 239 3075
                                </Text>
                            </Stack>
                        </Stack>
                    </Flex>

                    <Divider
                        my={{
                            base: 30,
                            md: 40,
                        }}
                    />

                    {/* Bottom */}
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
                            © {new Date().getFullYear()} SmileHaos Dental
                            Clinic. All rights reserved.
                        </Text>

                        <Group gap={5}>
                            <Text
                                size="xs"
                                c="dimmed"
                            >
                                ⚡ Powered by
                            </Text>

                            <Text
                                size="xs"
                                fw={700}
                                c="smilehaos.6"
                            >
                                Tooothy
                            </Text>
                        </Group>
                    </Flex>
                </Container>
            </Box>
        </footer>
    )
}

export default Footer
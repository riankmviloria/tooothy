import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'

import PublicLayout from '../layouts/PublicLayout'

function HomePage() {
  return (
    <PublicLayout>
      <main>
        {/* =====================================================
            HERO
        ===================================================== */}
        <section>
          <Container size="lg">
            <Flex
              direction={{
                base: 'column',
                md: 'row',
              }}
              align="center"
              gap={{
                base: 35,
                md: 70,
              }}
              py={{
                base: 40,
                sm: 70,
                md: 100,
              }}
            >
              {/* Hero Content */}
              <Box
                style={{
                  flex: 1,
                  width: '100%',
                }}
              >
                <Stack gap="xl">
                  <Badge
                    variant="light"
                    color="smilehaos"
                    size="lg"
                    radius="xl"
                    w="fit-content"
                  >
                    SmileHaos Dental Clinic · Iba, Zambales
                  </Badge>

                  <Stack gap="md">
                    <Title
                      order={1}
                      size="clamp(2.5rem, 11vw, 5.5rem)"
                      lh={0.95}
                      style={{
                        letterSpacing: '-0.055em',
                      }}
                    >
                      Healthy smiles,
                      <br />
                      <Text
                        span
                        c="smilehaos.6"
                        inherit
                      >
                        thoughtful care.
                      </Text>
                    </Title>

                    <Text
                      size="lg"
                      c="dimmed"
                      maw={580}
                      lh={1.7}
                    >
                      Comfortable, personalized dental care
                      for you and your family in Iba, Zambales.
                      From preventive care to restorative
                      treatments, we're here for your smile.
                    </Text>
                  </Stack>

                  {/* Hero Actions */}
                  <Flex
                    direction={{
                      base: 'column',
                      xs: 'row',
                    }}
                    gap="sm"
                    align="stretch"
                  >
                    <Button
                      component="a"
                      href="/book"
                      size="lg"
                      radius="md"
                      style={{
                        width: '100%',
                      }}
                      className="hero-button"
                    >
                      Book an appointment
                    </Button>

                    <Button
                      component="a"
                      href="#services"
                      variant="subtle"
                      size="lg"
                      color="smilehaos"
                      style={{
                        width: '100%',
                      }}
                      className="hero-button"
                    >
                      Explore our services
                    </Button>
                  </Flex>

                  {/* Trust Points */}
                  <Group
                    gap="md"
                    wrap="wrap"
                  >
                    <Group gap="xs">
                      <ThemeIcon
                        size={26}
                        radius="xl"
                        variant="light"
                        color="smilehaos"
                      >
                        ✓
                      </ThemeIcon>

                      <Text
                        size="sm"
                        c="dimmed"
                      >
                        Personalized care
                      </Text>
                    </Group>

                    <Group gap="xs">
                      <ThemeIcon
                        size={26}
                        radius="xl"
                        variant="light"
                        color="smilehaos"
                      >
                        ✓
                      </ThemeIcon>

                      <Text
                        size="sm"
                        c="dimmed"
                      >
                        Easy online booking
                      </Text>
                    </Group>
                  </Group>
                </Stack>
              </Box>

              {/* Hero Photo */}
              <Box
                style={{
                  flex: 1,
                  width: '100%',
                }}
              >
                <Card
                  radius="xl"
                  padding={0}
                  withBorder
                  style={{
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src="/images/treatment-room.jpg"
                    alt="SmileHaos Dental Clinic treatment room"
                    h={350}
                    fit="cover"
                  />
                </Card>
              </Box>
            </Flex>
          </Container>
        </section>

        {/* =====================================================
            CLINIC INTRODUCTION
        ===================================================== */}
        <section>
          <Container size="lg">
            <Flex
              direction={{
                base: 'column',
                md: 'row',
              }}
              gap={{
                base: 35,
                md: 70,
              }}
              align="center"
              py={{
                base: 45,
                sm: 70,
                md: 100,
              }}
            >
              {/* Reception Photo */}
              <Box
                style={{
                  flex: 1,
                  width: '100%',
                }}
              >
                <Card
                  radius="xl"
                  padding={0}
                  withBorder
                  style={{
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src="/images/clinic-reception.jpg"
                    alt="SmileHaos Dental Clinic reception"
                    h={320}
                    fit="cover"
                  />
                </Card>
              </Box>

              {/* Introduction */}
              <Box
                style={{
                  flex: 1,
                  width: '100%',
                }}
              >
                <Stack gap="lg">
                  <Text
                    fw={700}
                    c="smilehaos.6"
                  >
                    WELCOME TO SMILEHAOS
                  </Text>

                  <Title
                    order={2}
                    size="clamp(2rem, 8vw, 3.5rem)"
                    style={{
                      letterSpacing: '-0.04em',
                    }}
                  >
                    A comfortable space for your dental care.
                  </Title>

                  <Text
                    size="lg"
                    c="dimmed"
                    lh={1.7}
                  >
                    At SmileHaos Dental Clinic, we aim to make
                    every visit comfortable and personalized.
                    Whether you're coming in for a routine
                    cleaning, restoration, orthodontic treatment,
                    or another dental concern, we're here to
                    help.
                  </Text>

                  <Group gap="md" wrap="nowrap">
                    <ThemeIcon
                      size={48}
                      radius="md"
                      variant="light"
                      color="smilehaos"
                    >
                      🦷
                    </ThemeIcon>

                    <Stack gap={2}>
                      <Text fw={700}>
                        Personalized dental care
                      </Text>

                      <Text
                        size="sm"
                        c="dimmed"
                      >
                        Treatment based on your individual needs.
                      </Text>
                    </Stack>
                  </Group>

                  <Group gap="md" wrap="nowrap">
                    <ThemeIcon
                      size={48}
                      radius="md"
                      variant="light"
                      color="smilehaos"
                    >
                      ✨
                    </ThemeIcon>

                    <Stack gap={2}>
                      <Text fw={700}>
                        Comfortable environment
                      </Text>

                      <Text
                        size="sm"
                        c="dimmed"
                      >
                        A clean and welcoming space for your visit.
                      </Text>
                    </Stack>
                  </Group>

                  <Button
                    component="a"
                    href="/book"
                    size="lg"
                    radius="md"
                    className="mobile-full-button"
                  >
                    Book your visit
                  </Button>
                </Stack>
              </Box>
            </Flex>
          </Container>
        </section>

        {/* =====================================================
            SERVICES
        ===================================================== */}
        <section id="services">
          <Container size="lg">
            <Stack
              gap="xl"
              py={{
                base: 45,
                sm: 70,
                md: 100,
              }}
            >
              <Stack
                gap="xs"
                maw={700}
              >
                <Text
                  fw={700}
                  c="smilehaos.6"
                >
                  OUR SERVICES
                </Text>

                <Title
                  order={2}
                  size="clamp(2rem, 8vw, 3.5rem)"
                  style={{
                    letterSpacing: '-0.04em',
                  }}
                >
                  Dental care for every smile.
                </Title>

                <Text
                  size="lg"
                  c="dimmed"
                  lh={1.7}
                >
                  From routine preventive care to restorative
                  and cosmetic treatments, we're here to help
                  you maintain a healthy and confident smile.
                </Text>
              </Stack>

              <SimpleGrid
                cols={{
                  base: 1,
                  sm: 2,
                  md: 3,
                }}
                spacing="lg"
              >
                <ServiceCard
                  icon="🪥"
                  title="Dental Cleaning"
                  description="Keep your teeth and gums healthy, clean, and fresh with professional oral prophylaxis."
                />

                <ServiceCard
                  icon="🦷"
                  title="Tooth Restoration"
                  description="Restore damaged or decayed teeth with treatment tailored to the condition of each tooth."
                />

                <ServiceCard
                  icon="🦷"
                  title="Tooth Extraction"
                  description="Professional tooth removal with careful assessment and your comfort in mind."
                />

                <ServiceCard
                  icon="✨"
                  title="Teeth Whitening"
                  description="Brighten your smile with professional teeth whitening treatment in the clinic."
                />

                <ServiceCard
                  icon="😁"
                  title="Braces"
                  description="Explore orthodontic treatment options designed to improve your smile and bite."
                />

                <ServiceCard
                  icon="🦷"
                  title="Dentures"
                  description="Replace missing teeth with denture options based on your individual dental needs."
                />
              </SimpleGrid>
            </Stack>
          </Container>
        </section>

        {/* =====================================================
            MEET YOUR DENTIST
        ===================================================== */}
        <section id="dentist">
          <Container size="lg">
            <Card
              radius="xl"
              withBorder
              my={60}
              padding={0}
              style={{
                overflow: 'hidden',
              }}
            >
              <Flex
                direction={{
                  base: 'column',
                  sm: 'row',
                }}
                align="center"
                gap={{
                  base: 25,
                  sm: 40,
                  md: 60,
                }}
                p={40}
              >
                {/* Dentist Photo */}
                <Box
                  style={{
                    flexShrink: 0,
                  }}
                >
                  <Box
                    style={{
                      position: 'relative',
                    }}
                  >
                    <Card
                      padding={6}
                      radius="50%"
                      withBorder
                      style={{
                        overflow: 'hidden',
                      }}
                    >
                      <Image
                        src="/images/dentist1.jpeg"
                        alt="Dr. Amanda Hershey Gascon"
                        w={190}
                        h={190}
                        radius="50%"
                        fit="cover"
                      />
                    </Card>

                    <ThemeIcon
                      size={38}
                      radius="xl"
                      variant="filled"
                      color="smilehaos"
                      style={{
                        position: 'absolute',
                        bottom: 6,
                        right: 6,
                        border: '4px solid white',
                      }}
                    >
                      ✓
                    </ThemeIcon>
                  </Box>
                </Box>

                {/* Dentist Information */}
                <Stack
                  gap="md"
                  maw={620}
                  align="center"
                  ta="center"
                  style={{
                    flex: 1,
                  }}
                >
                  <Badge
                    variant="light"
                    color="smilehaos"
                    size="md"
                    radius="xl"
                    w="fit-content"
                  >
                    MEET YOUR DENTIST
                  </Badge>

                  <Stack gap={4}>
                    <Title
                      order={2}
                      size="clamp(2rem, 8vw, 3.2rem)"
                      style={{
                        letterSpacing: '-0.045em',
                      }}
                    >
                      Dr. Amanda Hershey Gascon
                    </Title>

                    <Text
                      size="lg"
                      fw={600}
                      c="smilehaos.6"
                    >
                      Doctor of Medicine in Dentistry
                    </Text>
                  </Stack>

                  <Text
                    size="lg"
                    c="dimmed"
                    lh={1.7}
                    maw={560}
                  >
                    Dedicated to providing compassionate and
                    personalized dental care in a comfortable and
                    welcoming environment. Every treatment is
                    thoughtfully tailored to help patients achieve
                    a healthy and confident smile.
                  </Text>

                  {/* Highlights */}
                  <Group
                    gap="md"
                    mt="xs"
                    wrap="wrap"
                    justify="center"
                  >
                    <Group gap="xs">
                      <ThemeIcon
                        size={28}
                        radius="xl"
                        variant="light"
                        color="smilehaos"
                      >
                        ✓
                      </ThemeIcon>

                      <Text
                        size="sm"
                        fw={600}
                      >
                        Personalized care
                      </Text>
                    </Group>

                    <Group gap="xs">
                      <ThemeIcon
                        size={28}
                        radius="xl"
                        variant="light"
                        color="smilehaos"
                      >
                        ✓
                      </ThemeIcon>

                      <Text
                        size="sm"
                        fw={600}
                      >
                        Patient-focused
                      </Text>
                    </Group>
                  </Group>

                  {/* Dentist Actions */}
                  <Group
                    mt="sm"
                    gap="sm"
                    grow
                    style={{
                      width: '100%',
                      maxWidth: 420,
                    }}
                  >
                    <Button
                      component="a"
                      href="/book"
                      size="md"
                      radius="md"
                    >
                      Book an appointment
                    </Button>

                    <Button
                      component="a"
                      href="#services"
                      size="md"
                      radius="md"
                      variant="subtle"
                      color="smilehaos"
                    >
                      View services
                    </Button>
                  </Group>
                </Stack>
              </Flex>
            </Card>
          </Container>
        </section>

        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}
        <section
          id="how-it-works"
          style={{
            background:
              'var(--mantine-color-smilehaos-0)',
          }}
        >
          <Container size="lg">
            <Stack
              gap="xl"
              py={{
                base: 45,
                sm: 70,
                md: 100,
              }}
            >
              <Stack
                gap="xs"
                maw={700}
              >
                <Text
                  fw={700}
                  c="smilehaos.7"
                >
                  YOUR VISIT, MADE EASY
                </Text>

                <Title
                  order={2}
                  size="clamp(2rem, 8vw, 3.5rem)"
                  style={{
                    letterSpacing: '-0.04em',
                  }}
                >
                  Book your visit in three simple steps.
                </Title>

                <Text
                  size="lg"
                  c="dimmed"
                  lh={1.7}
                >
                  No complicated forms. Just choose your
                  treatment, find a convenient time, and send
                  your appointment request.
                </Text>
              </Stack>

              <SimpleGrid
                cols={{
                  base: 1,
                  md: 3,
                }}
                spacing="lg"
              >
                <Step
                  number="01"
                  icon="🦷"
                  title="Choose a service"
                  description="Select the dental service that's right for your needs."
                />

                <Step
                  number="02"
                  icon="📅"
                  title="Pick a convenient time"
                  description="Choose an available date and appointment time that works for you."
                />

                <Step
                  number="03"
                  icon="✓"
                  title="Confirm your request"
                  description="Provide your details and submit your appointment request for clinic confirmation."
                />
              </SimpleGrid>
            </Stack>
          </Container>
        </section>

        {/* =====================================================
            FINAL CTA
        ===================================================== */}
        <section>
          <Container size="lg">
            <Card
              radius="xl"
              padding="xl"
              my={60}
              withBorder
            >
              <Stack
                align="center"
                ta="center"
                gap="lg"
              >
                <ThemeIcon
                  size={58}
                  radius="xl"
                  variant="light"
                  color="smilehaos"
                >
                  🦷
                </ThemeIcon>

                <Stack gap="xs">
                  <Title
                    order={2}
                    size="clamp(2rem, 8vw, 3rem)"
                    style={{
                      letterSpacing: '-0.04em',
                    }}
                  >
                    Ready to take care of your smile?
                  </Title>

                  <Text
                    size="lg"
                    c="dimmed"
                    maw={600}
                    lh={1.7}
                  >
                    Request your appointment online and let
                    SmileHaos Dental Clinic take care of the rest.
                  </Text>
                </Stack>

                <Button
                  component="a"
                  href="/book"
                  size="lg"
                  radius="md"
                  className="mobile-full-button"
                >
                  Book an appointment
                </Button>
              </Stack>
            </Card>
          </Container>
        </section>
      </main>

      {/* =====================================================
          MOBILE RESPONSIVE STYLES
      ===================================================== */}
      <style>
        {`
          @media (min-width: 576px) {
            .hero-button {
              width: auto !important;
            }

            .mobile-full-button {
              width: fit-content !important;
            }
          }

          @media (max-width: 575px) {
            .mobile-full-button {
              width: 100%;
            }
          }
        `}
      </style>
    </PublicLayout>
  )
}

/* =========================================================
   SERVICE CARD
========================================================= */

type ServiceCardProps = {
  icon: string
  title: string
  description: string
}

function ServiceCard({
  icon,
  title,
  description,
}: ServiceCardProps) {
  return (
    <Card
      padding="lg"
      radius="lg"
      withBorder
      h="100%"
    >
      <Stack gap="md">
        <ThemeIcon
          size={54}
          radius="lg"
          variant="light"
          color="smilehaos"
        >
          {icon}
        </ThemeIcon>

        <Stack gap="xs">
          <Title
            order={3}
            size="h3"
          >
            {title}
          </Title>

          <Text
            c="dimmed"
            lh={1.6}
          >
            {description}
          </Text>
        </Stack>
      </Stack>
    </Card>
  )
}

/* =========================================================
   STEP
========================================================= */

type StepProps = {
  number: string
  icon: string
  title: string
  description: string
}

function Step({
  number,
  icon,
  title,
  description,
}: StepProps) {
  return (
    <Card
      padding="lg"
      radius="lg"
      withBorder
      h="100%"
    >
      <Stack gap="lg">
        <Group justify="space-between">
          <ThemeIcon
            size={52}
            radius="lg"
            variant="light"
            color="smilehaos"
          >
            {icon}
          </ThemeIcon>

          <Text
            fw={800}
            size="sm"
            c="smilehaos.6"
          >
            {number}
          </Text>
        </Group>

        <Stack gap="xs">
          <Title
            order={3}
            size="h3"
          >
            {title}
          </Title>

          <Text
            c="dimmed"
            lh={1.6}
          >
            {description}
          </Text>
        </Stack>
      </Stack>
    </Card>
  )
}

export default HomePage
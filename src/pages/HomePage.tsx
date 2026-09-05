import {
  Badge,
  Box,
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
  Button
} from '@mantine/core'

import { motion } from 'motion/react'

import PublicLayout from '../layouts/PublicLayout'

/* =========================================================
   MOTION VARIANTS
========================================================= */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },

  visible: {
    opacity: 1,
    y: 0,
  },
}

const fadeIn = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
  },
}

const staggerContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const viewport = {
  once: true,
  amount: 0.2,
}

/* =========================================================
   HOME PAGE
========================================================= */

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
              py="xl"
            >
              {/* =================================================
                  HERO CONTENT
              ================================================= */}

              <Box
                style={{
                  flex: 1,
                  width: '100%',
                }}
              >
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <Stack gap="xl">

                    {/* Badge */}

                    <motion.div variants={fadeUp}>
                      <Badge
                        variant="light"
                        color="smilehaos"
                        size="lg"
                        radius="xl"
                        w="fit-content"
                      >
                        SmileHaos Dental Clinic · Iba, Zambales
                      </Badge>
                    </motion.div>

                    {/* Heading */}

                    <motion.div variants={fadeUp}>
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
                    </motion.div>

                    {/* =================================================
                        HERO ACTIONS
                    ================================================= */}

                    <motion.div variants={fadeUp}>
                      <Flex
                        direction={{
                          base: 'column',
                          xs: 'row',
                        }}
                        gap="sm"
                        align="stretch"
                      >
                        <motion.div
                          whileHover={{
                            y: -3,
                          }}
                          whileTap={{
                            scale: 0.97,
                          }}
                          style={{
                            flex: 1,
                          }}
                        >
                          <ButtonPlaceholder
                            href="/book"
                            primary
                          />
                        </motion.div>

                        <motion.div
                          whileHover={{
                            y: -3,
                          }}
                          whileTap={{
                            scale: 0.97,
                          }}
                          style={{
                            flex: 1,
                          }}
                        >
                          <ButtonPlaceholder
                            href="#services"
                          />
                        </motion.div>
                      </Flex>
                    </motion.div>

                    {/* =================================================
                        TRUST POINTS
                    ================================================= */}

                    <motion.div variants={fadeUp}>
                      <Group
                        gap="md"
                        wrap="wrap"
                      >
                        <TrustPoint>
                          Personalized care
                        </TrustPoint>

                        <TrustPoint>
                          Easy online booking
                        </TrustPoint>
                      </Group>
                    </motion.div>

                  </Stack>
                </motion.div>
              </Box>

              {/* =================================================
                  HERO PHOTO
              ================================================= */}

              <Box
                style={{
                  flex: 1,
                  width: '100%',
                }}
              >
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  transition={{
                    duration: 0.8,
                    delay: 0.25,
                    ease: 'easeOut',
                  }}
                >
                  <motion.div
                    whileHover={{
                      scale: 1.02,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                  >
                    <Card
                      radius="xl"
                      padding={0}
                      withBorder
                      style={{
                        overflow: 'hidden',
                        boxShadow:
                          '0 25px 70px rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      <Image
                        src="/images/treatment-room.jpg"
                        alt="SmileHaos Dental Clinic treatment room"
                        h={350}
                        fit="cover"
                      />
                    </Card>
                  </motion.div>
                </motion.div>
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
              py="xl"
            >

              {/* Reception Photo */}

              <Box
                style={{
                  flex: 1,
                  width: '100%',
                }}
              >
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                  transition={{
                    duration: 0.7,
                    ease: 'easeOut',
                  }}
                >
                  <motion.div
                    whileHover={{
                      scale: 1.02,
                    }}
                    transition={{
                      duration: 0.3,
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
                  </motion.div>
                </motion.div>
              </Box>

              {/* Introduction */}

              <Box
                style={{
                  flex: 1,
                  width: '100%',
                }}
              >
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                >
                  <Stack gap="lg">

                    <motion.div variants={fadeUp}>
                      <Text
                        fw={700}
                        c="smilehaos.6"
                      >
                        WELCOME TO SMILEHAOS
                      </Text>
                    </motion.div>

                    <motion.div variants={fadeUp}>
                      <Title
                        order={2}
                        size="clamp(2rem, 8vw, 3.5rem)"
                        style={{
                          letterSpacing: '-0.04em',
                        }}
                      >
                        A comfortable space for your dental care.
                      </Title>
                    </motion.div>

                    <motion.div variants={fadeUp}>
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
                    </motion.div>

                    {/* =================================================
                        CARE HIGHLIGHT
                    ================================================= */}

                    <motion.div variants={fadeUp}>
                      <Group
                        gap="md"
                        wrap="nowrap"
                      >
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
                    </motion.div>

                    <motion.div variants={fadeUp}>
                      <Group
                        gap="md"
                        wrap="nowrap"
                      >
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
                    </motion.div>

                  </Stack>
                </motion.div>
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
              py="xl"
            >

              {/* Services Heading */}

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                transition={{
                  duration: 0.6,
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
              </motion.div>

              {/* Service Cards */}

              <SimpleGrid
                cols={{
                  base: 1,
                  sm: 2,
                  md: 3,
                }}
                spacing="lg"
              >
                <AnimatedServiceCard
                  icon="🪥"
                  title="Dental Cleaning"
                  description="Keep your teeth and gums healthy, clean, and fresh with professional oral prophylaxis."
                />

                <AnimatedServiceCard
                  icon="🦷"
                  title="Tooth Restoration"
                  description="Restore damaged or decayed teeth with treatment tailored to the condition of each tooth."
                />

                <AnimatedServiceCard
                  icon="🦷"
                  title="Tooth Extraction"
                  description="Professional tooth removal with careful assessment and your comfort in mind."
                />

                <AnimatedServiceCard
                  icon="✨"
                  title="Teeth Whitening"
                  description="Brighten your smile with professional teeth whitening treatment in the clinic."
                />

                <AnimatedServiceCard
                  icon="😁"
                  title="Braces"
                  description="Explore orthodontic treatment options designed to improve your smile and bite."
                />

                <AnimatedServiceCard
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
            <motion.div
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={viewport}
              transition={{
                duration: 0.7,
                ease: 'easeOut',
              }}
            >
              <Card
                radius="xl"
                withBorder
                my={60}
                padding={0}
                style={{
                  overflow: 'hidden',
                  boxShadow:
                    '0 25px 80px rgba(0, 0, 0, 0.06)',
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
                    <motion.div
                      whileHover={{
                        scale: 1.04,
                      }}
                      transition={{
                        duration: 0.3,
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
                    </motion.div>
                  </Box>

                  {/* Dentist Information */}

                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    style={{
                      flex: 1,
                      width: '100%',
                    }}
                  >
                    <Stack
                      gap="md"
                      maw={620}
                      align="center"
                      ta="center"
                    >

                      <motion.div variants={fadeUp}>
                        <Badge
                          variant="light"
                          color="smilehaos"
                          size="md"
                          radius="xl"
                          w="fit-content"
                        >
                          MEET YOUR DENTIST
                        </Badge>
                      </motion.div>

                      <motion.div variants={fadeUp}>
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
                      </motion.div>

                      <motion.div variants={fadeUp}>
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
                      </motion.div>

                      {/* Highlights */}

                      <motion.div variants={fadeUp}>
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
                      </motion.div>

                    </Stack>
                  </motion.div>

                </Flex>
              </Card>
            </motion.div>
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
              py="xl"
            >

              {/* Heading */}

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                transition={{
                  duration: 0.6,
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
              </motion.div>

              {/* Steps */}

              <SimpleGrid
                cols={{
                  base: 1,
                  md: 3,
                }}
                spacing="lg"
              >
                <AnimatedStep
                  number="01"
                  icon="🦷"
                  title="Choose a service"
                  description="Select the dental service that's right for your needs."
                />

                <AnimatedStep
                  number="02"
                  icon="📅"
                  title="Pick a convenient time"
                  description="Choose an available date and appointment time that works for you."
                />

                <AnimatedStep
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
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={viewport}
              transition={{
                duration: 0.7,
                ease: 'easeOut',
              }}
            >
              <Card
                radius="xl"
                padding="xl"
                my={60}
                withBorder
                style={{
                  background:
                    'linear-gradient(135deg, #ffffff 0%, var(--mantine-color-smilehaos-0) 100%)',
                  boxShadow:
                    '0 25px 80px rgba(0, 0, 0, 0.06)',
                }}
              >
                <Stack
                  align="center"
                  ta="center"
                  gap="lg"
                >

                  {/* Icon */}

                  <motion.div
                    initial={{
                      scale: 0.8,
                      opacity: 0,
                    }}
                    whileInView={{
                      scale: 1,
                      opacity: 1,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.5,
                    }}
                  >
                    <ThemeIcon
                      size={58}
                      radius="xl"
                      variant="light"
                      color="smilehaos"
                    >
                      🦷
                    </ThemeIcon>
                  </motion.div>

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

                  {/* Final CTA */}

                  <motion.div
                    whileHover={{
                      y: -3,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                  >
                    <Button
                      component="a"
                      href="/book"
                      size="lg"
                      radius="xl"
                      className="mobile-full-button"
                    >
                      Book an appointment
                    </Button>
                  </motion.div>

                </Stack>
              </Card>
            </motion.div>
          </Container>
        </section>

      </main>

      {/* =====================================================
          RESPONSIVE STYLES
      ===================================================== */}

      <style>
        {`
          @media (min-width: 576px) {
            .mobile-full-button {
              width: fit-content !important;
            }
          }

          @media (max-width: 575px) {
            .mobile-full-button {
              width: 100%;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}
      </style>
    </PublicLayout>
  )
}

/* =========================================================
   BUTTON PLACEHOLDER
========================================================= */

type ButtonPlaceholderProps = {
  href: string
  primary?: boolean
}

function ButtonPlaceholder({
  href,
  primary = false,
}: ButtonPlaceholderProps) {
  return (
    <Box
      component="a"
      href={href}
      style={{
        display: 'block',
        width: '100%',
        textDecoration: 'none',
      }}
    >
      <Box
        component="span"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 44,
          padding: '0 18px',
          borderRadius: 12,
          background: primary
            ? 'var(--mantine-color-smilehaos-6)'
            : 'transparent',
          color: primary
            ? 'white'
            : 'var(--mantine-color-smilehaos-6)',
          border: primary
            ? '1px solid var(--mantine-color-smilehaos-6)'
            : '1px solid transparent',
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        {primary
          ? 'Book an appointment'
          : 'Explore our services'}
      </Box>
    </Box>
  )
}

/* =========================================================
   TRUST POINT
========================================================= */

function TrustPoint({
  children,
}: {
  children: React.ReactNode
}) {
  return (
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
        {children}
      </Text>
    </Group>
  )
}

/* =========================================================
   ANIMATED SERVICE CARD
========================================================= */

type ServiceCardProps = {
  icon: string
  title: string
  description: string
}

function AnimatedServiceCard({
  icon,
  title,
  description,
}: ServiceCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={{
        duration: 0.5,
        ease: 'easeOut',
      }}
      whileHover={{
        y: -6,
      }}
    >
      <Card
        padding="lg"
        radius="lg"
        withBorder
        h="100%"
        style={{
          transition:
            'box-shadow 200ms ease',
        }}
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
    </motion.div>
  )
}

/* =========================================================
   ANIMATED STEP
========================================================= */

type StepProps = {
  number: string
  icon: string
  title: string
  description: string
}

function AnimatedStep({
  number,
  icon,
  title,
  description,
}: StepProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={{
        duration: 0.5,
        ease: 'easeOut',
      }}
      whileHover={{
        y: -6,
      }}
    >
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
    </motion.div>
  )
}

export default HomePage
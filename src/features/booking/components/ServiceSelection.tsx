import {
  Badge,
  Button,
  Card,
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
import { motion } from 'motion/react'
import {
  IconArrowRight,
  IconCheck,
  IconDental,
  IconSparkles,
} from '@tabler/icons-react'

import ServiceCard from './ServiceCard'
import BookingHeader from './BookingHeader'
import type { Service } from '../../services/types/service.types'

type ServiceSelectionProps = {
  services: Service[]
  selectedService: Service | null
  onSelect: (service: Service) => void
  onContinue: () => void
}

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
}

function ServiceSelection({
  services,
  selectedService,
  onSelect,
  onContinue,
}: ServiceSelectionProps) {
  return (
    <>
      <BookingHeader step={1} totalSteps={4} />

      <main
        style={{
          overflow: 'hidden',
          background:
            'linear-gradient(180deg, var(--mantine-color-gray-0) 0%, #ffffff 48%, var(--mantine-color-smilehaos-0) 100%)',
        }}
      >
        <Container
          size="lg"
          py="xl"
        >
          <Stack gap={32}>
            {/* =====================================================
                HERO
            ===================================================== */}

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{
                duration: 0.55,
                ease: 'easeOut',
              }}
            >
              <Stack gap="md">
                <Group gap="sm">
                  <Badge
                    color="smilehaos"
                    variant="light"
                    size="lg"
                    radius="xl"
                    leftSection={
                      <IconSparkles size={14} />
                    }
                  >
                    Step 1 · Start your visit
                  </Badge>

                  {selectedService && (
                    <Badge
                      color="smilehaos"
                      variant="filled"
                      size="lg"
                      radius="xl"
                      leftSection={
                        <IconCheck size={14} />
                      }
                    >
                      Service selected
                    </Badge>
                  )}
                </Group>

                <Title
                  order={1}
                  size="clamp(2.8rem, 7vw, 5.5rem)"
                  style={{
                    maxWidth: 950,
                    lineHeight: 0.96,
                    letterSpacing: '-0.055em',
                  }}
                >
                  Let's start with
                  <br />

                  <Text
                    component="span"
                    inherit
                    c="smilehaos.6"
                  >
                    your smile.
                  </Text>
                </Title>

                <Text
                  size="xl"
                  c="dimmed"
                  maw={680}
                  style={{
                    lineHeight: 1.6,
                  }}
                >
                  Choose the dental service you'd like to
                  book. We'll find the perfect time for you
                  next.
                </Text>
              </Stack>
            </motion.div>

            {/* =====================================================
                SERVICES CONTAINER
            ===================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 24,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.12,
                ease: 'easeOut',
              }}
            >
              <Paper
                radius={32}
                p="xl"
                withBorder
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  background: '#ffffff',
                  borderColor:
                    'var(--mantine-color-gray-2)',
                  boxShadow:
                    '0 30px 90px rgba(0, 0, 0, 0.09)',
                }}
              >
                {/* =================================================
                    DECORATIVE CIRCLE
                ================================================= */}

                <motion.div
                  animate={{
                    rotate: [0, 8, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    position: 'absolute',
                    width: 240,
                    height: 240,
                    borderRadius: '50%',
                    background:
                      'var(--mantine-color-smilehaos-0)',
                    right: -100,
                    top: -110,
                    pointerEvents: 'none',
                  }}
                />

                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, -5, 0],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    position: 'absolute',
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background:
                      'var(--mantine-color-smilehaos-1)',
                    left: -80,
                    bottom: -80,
                    pointerEvents: 'none',
                  }}
                />

                <Stack
                  gap="xl"
                  style={{
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {/* =================================================
                      SECTION HEADER
                  ================================================= */}

                  <Flex
                    justify="space-between"
                    align="center"
                    gap="md"
                    direction="row"
                    wrap="wrap"
                  >
                    <Group
                      gap="md"
                      align="center"
                    >
                      <ThemeIcon
                        size={58}
                        radius="xl"
                        variant="light"
                        color="smilehaos"
                      >
                        <IconDental size={30} />
                      </ThemeIcon>

                      <Stack gap={2}>
                        <Title
                          order={2}
                          size="clamp(1.5rem, 4vw, 2.2rem)"
                          style={{
                            letterSpacing:
                              '-0.035em',
                          }}
                        >
                          What are we fixing?
                        </Title>

                        <Text
                          size="sm"
                          c="dimmed"
                        >
                          Pick one service to continue.
                        </Text>
                      </Stack>
                    </Group>

                    <Badge
                      variant="light"
                      color="gray"
                      radius="xl"
                      size="lg"
                    >
                      {services.length}{' '}
                      {services.length === 1
                        ? 'service'
                        : 'services'}
                    </Badge>
                  </Flex>

                  {/* =================================================
                      SERVICE CARDS
                  ================================================= */}

                  <SimpleGrid
                    cols={{
                      base: 1,
                      sm: 2,
                    }}
                    spacing="lg"
                  >
                    {services.map(
                      (service, index) => (
                        <motion.div
                          key={service.id}
                          initial={{
                            opacity: 0,
                            y: 20,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            duration: 0.45,
                            delay:
                              0.18 + index * 0.07,
                            ease: 'easeOut',
                          }}
                        >
                          <ServiceCard
                            service={service}
                            selected={
                              selectedService?.id ===
                              service.id
                            }
                            onSelect={() =>
                              onSelect(service)
                            }
                          />
                        </motion.div>
                      ),
                    )}
                  </SimpleGrid>

                  {/* =================================================
                      SELECTED SERVICE
                  ================================================= */}

                  <motion.div
                    initial={false}
                    animate={{
                      opacity: selectedService
                        ? 1
                        : 0.55,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                  >
                    <Card
                      radius="xl"
                      p="lg"
                      withBorder
                      style={{
                        background:
                          selectedService
                            ? 'var(--mantine-color-smilehaos-0)'
                            : 'var(--mantine-color-gray-0)',
                        borderColor:
                          selectedService
                            ? 'var(--mantine-color-smilehaos-2)'
                            : 'var(--mantine-color-gray-2)',
                        transition:
                          'background-color 200ms ease, border-color 200ms ease',
                      }}
                    >
                      {selectedService ? (
                        <Group
                          justify="space-between"
                          align="center"
                          wrap="nowrap"
                        >
                          <Group
                            gap="md"
                            wrap="nowrap"
                          >
                            <ThemeIcon
                              size={52}
                              radius="lg"
                              color="smilehaos"
                              variant="filled"
                            >
                              {
                                selectedService.icon
                              }
                            </ThemeIcon>

                            <Stack gap={2}>
                              <Text
                                size="xs"
                                fw={800}
                                tt="uppercase"
                                c="smilehaos.7"
                                style={{
                                  letterSpacing:
                                    '0.12em',
                                }}
                              >
                                Your selection
                              </Text>

                              <Text
                                fw={800}
                                size="lg"
                              >
                                {
                                  selectedService.name
                                }
                              </Text>

                              <Text
                                size="sm"
                                c="dimmed"
                              >
                                {
                                  selectedService.duration
                                }{' '}
                                minutes ·{' '}
                                {selectedService.priceLabel ||
                                  `₱${selectedService.price.toLocaleString()}`}
                              </Text>
                            </Stack>
                          </Group>

                          <ThemeIcon
                            size={40}
                            radius="xl"
                            color="smilehaos"
                            variant="light"
                          >
                            <IconCheck
                              size={20}
                            />
                          </ThemeIcon>
                        </Group>
                      ) : (
                        <Group
                          justify="center"
                          gap="sm"
                        >
                          <IconSparkles
                            size={18}
                            style={{
                              opacity: 0.5,
                            }}
                          />

                          <Text
                            size="sm"
                            c="dimmed"
                            fw={500}
                          >
                            Select a service above to
                            continue
                          </Text>
                        </Group>
                      )}
                    </Card>
                  </motion.div>
                </Stack>
              </Paper>
            </motion.div>

            <Divider />

            {/* =====================================================
                CONTINUE
            ===================================================== */}

            <Flex
              justify="flex-end"
              direction="row"
            >
              <motion.div
                whileHover={
                  selectedService
                    ? {
                        scale: 1.025,
                      }
                    : undefined
                }
                whileTap={
                  selectedService
                    ? {
                        scale: 0.97,
                      }
                    : undefined
                }
                style={{
                  width: '100%',
                  maxWidth: 260,
                }}
              >
                <Button
                  size="lg"
                  radius="xl"
                  fullWidth
                  disabled={!selectedService}
                  onClick={onContinue}
                  rightSection={
                    <IconArrowRight size={19} />
                  }
                  style={{
                    boxShadow: selectedService
                      ? '0 12px 30px rgba(0, 0, 0, 0.12)'
                      : undefined,
                  }}
                >
                  Continue to date
                </Button>
              </motion.div>
            </Flex>
          </Stack>
        </Container>
      </main>
    </>
  )
}

export default ServiceSelection
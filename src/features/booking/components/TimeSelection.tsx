import {
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { motion } from 'motion/react'
import {
  IconArrowLeft,
  IconArrowRight,
  IconCalendar,
  IconCheck,
  IconClock,
  IconSparkles,
} from '@tabler/icons-react'

import BookingHeader from './BookingHeader'

import type {
  TimeSlot,
} from '../types/booking.types'
import type { Service } from '../../services/types/service.types'

type TimeSelectionProps = {
  selectedService: Service | null
  selectedDate: string | null
  selectedTime: string | null
  timeSlots: TimeSlot[]
  bookedTimes: string[]
  isLoadingBookedTimes: boolean
  onTimeChange: (time: string) => void
  onBack: () => void
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

function TimeSelection({
  selectedService,
  selectedDate,
  selectedTime,
  timeSlots,
  bookedTimes,
  isLoadingBookedTimes,
  onTimeChange,
  onBack,
  onContinue,
}: TimeSelectionProps) {
  const formattedDate = selectedDate
    ? new Date(
        `${selectedDate}T00:00:00`,
      ).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No date selected'

  const shortDate = selectedDate
    ? new Date(
        `${selectedDate}T00:00:00`,
      ).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null

  const availableSlots = timeSlots.filter(
    (slot) =>
      slot.available &&
      !bookedTimes.includes(slot.time),
  )

  return (
    <>
      <BookingHeader
        step={3}
        totalSteps={4}
      />

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
                    Step 3 · Pick your moment
                  </Badge>

                  {selectedTime && (
                    <Badge
                      color="smilehaos"
                      variant="filled"
                      size="lg"
                      radius="xl"
                      leftSection={
                        <IconCheck size={14} />
                      }
                    >
                      Time selected
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
                  Find your
                  <br />

                  <Text
                    component="span"
                    inherit
                    c="smilehaos.6"
                  >
                    perfect time.
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
                  Your date is locked in. Now let's find
                  a time that fits your day.
                </Text>
              </Stack>
            </motion.div>

            {/* =====================================================
                APPOINTMENT CONTEXT
            ===================================================== */}

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{
                duration: 0.55,
                delay: 0.1,
                ease: 'easeOut',
              }}
            >
              <Card
                radius="xl"
                padding="lg"
                withBorder
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))',
                  backdropFilter: 'blur(12px)',
                  borderColor:
                    'var(--mantine-color-smilehaos-2)',
                  boxShadow:
                    '0 18px 50px rgba(0, 0, 0, 0.07)',
                }}
              >
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
                      size={58}
                      radius="lg"
                      variant="gradient"
                      gradient={{
                        from: 'smilehaos.4',
                        to: 'smilehaos.7',
                        deg: 135,
                      }}
                    >
                      <IconCalendar size={30} />
                    </ThemeIcon>

                    <Stack gap={3}>
                      <Text
                        size="xs"
                        fw={800}
                        tt="uppercase"
                        c="smilehaos.7"
                        style={{
                          letterSpacing: '0.12em',
                        }}
                      >
                        Your appointment
                      </Text>

                      <Text
                        fw={800}
                        size="lg"
                      >
                        {formattedDate}
                      </Text>

                      <Group
                        gap="xs"
                        c="dimmed"
                      >
                        <Text size="sm">
                          {selectedService?.name}
                        </Text>

                        <Text size="sm">
                          ·
                        </Text>

                        <Text size="sm">
                          {selectedService?.duration}{' '}
                          minutes
                        </Text>
                      </Group>
                    </Stack>
                  </Group>

                  {shortDate && (
                    <Badge
                      size="xl"
                      radius="xl"
                      color="smilehaos"
                      variant="light"
                      px="lg"
                    >
                      {shortDate}
                    </Badge>
                  )}
                </Group>
              </Card>
            </motion.div>

            {/* =====================================================
                TIME SELECTION CARD
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
                delay: 0.16,
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
                    DECORATIVE CIRCLES
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
                    width: 230,
                    height: 230,
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
                      HEADER
                  ================================================= */}

                  <Flex
                    justify="space-between"
                    align="center"
                    gap="md"
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
                        <IconClock size={30} />
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
                          What time feels right?
                        </Title>

                        <Text
                          size="sm"
                          c="dimmed"
                        >
                          Choose from the available
                          appointment slots.
                        </Text>
                      </Stack>
                    </Group>

                    {isLoadingBookedTimes ? (
                      <Badge
                        color="smilehaos"
                        variant="light"
                        size="lg"
                        radius="xl"
                        leftSection={
                          <Loader
                            size={12}
                            color="smilehaos"
                          />
                        }
                      >
                        Checking availability
                      </Badge>
                    ) : (
                      <Badge
                        color="gray"
                        variant="light"
                        size="lg"
                        radius="xl"
                      >
                        {availableSlots.length}{' '}
                        {availableSlots.length === 1
                          ? 'time'
                          : 'times'}{' '}
                        available
                      </Badge>
                    )}
                  </Flex>

                  <Divider />

                  {/* =================================================
                      LOADING STATE
                  ================================================= */}

                  {isLoadingBookedTimes ? (
                    <Stack
                      align="center"
                      gap="md"
                      py="xl"
                    >
                      <motion.div
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 1.4,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      >
                        <ThemeIcon
                          size={68}
                          radius="xl"
                          variant="light"
                          color="smilehaos"
                        >
                          <IconClock
                            size={32}
                          />
                        </ThemeIcon>
                      </motion.div>

                      <Stack
                        align="center"
                        gap={4}
                      >
                        <Text
                          fw={800}
                          size="lg"
                        >
                          Checking the schedule...
                        </Text>

                        <Text
                          size="sm"
                          c="dimmed"
                          ta="center"
                        >
                          Making sure your chosen time
                          is still available.
                        </Text>
                      </Stack>
                    </Stack>
                  ) : (
                    <>
                      {/* =============================================
                          TIME SLOTS
                      ============================================= */}

                      <SimpleGrid
                        cols={{
                          base: 2,
                          xs: 3,
                          sm: 4,
                        }}
                        spacing="md"
                      >
                        {timeSlots.map(
                          (slot, index) => {
                            const selected =
                              selectedTime ===
                              slot.time

                            const booked =
                              bookedTimes.includes(
                                slot.time,
                              )

                            const unavailable =
                              !slot.available ||
                              booked

                            return (
                              <motion.div
                                key={slot.time}
                                initial={{
                                  opacity: 0,
                                  y: 16,
                                  scale: 0.96,
                                }}
                                animate={{
                                  opacity: 1,
                                  y: 0,
                                  scale: 1,
                                }}
                                transition={{
                                  duration: 0.35,
                                  delay:
                                    index * 0.035,
                                  ease: 'easeOut',
                                }}
                                whileHover={
                                  !unavailable
                                    ? {
                                        y: -4,
                                        scale: 1.025,
                                      }
                                    : undefined
                                }
                                whileTap={
                                  !unavailable
                                    ? {
                                        scale: 0.96,
                                      }
                                    : undefined
                                }
                              >
                                <Button
                                  variant={
                                    selected
                                      ? 'filled'
                                      : unavailable
                                        ? 'light'
                                        : 'light'
                                  }
                                  color="smilehaos"
                                  size="lg"
                                  h={72}
                                  fullWidth
                                  radius="xl"
                                  disabled={
                                    unavailable ||
                                    isLoadingBookedTimes
                                  }
                                  onClick={() =>
                                    onTimeChange(
                                      slot.time,
                                    )
                                  }
                                  style={{
                                    border:
                                      selected
                                        ? '2px solid var(--mantine-color-smilehaos-6)'
                                        : '1px solid var(--mantine-color-gray-3)',
                                    opacity:
                                      unavailable
                                        ? 0.48
                                        : 1,
                                    boxShadow:
                                      selected
                                        ? '0 12px 28px rgba(0, 0, 0, 0.12)'
                                        : undefined,
                                    transition:
                                      'border-color 180ms ease, box-shadow 180ms ease',
                                  }}
                                >
                                  <Stack
                                    gap={1}
                                    align="center"
                                  >
                                    <Text
                                      fw={800}
                                      size="md"
                                    >
                                      {booked
                                        ? 'Booked'
                                        : slot.time}
                                    </Text>

                                    {selected && (
                                      <Group
                                        gap={4}
                                      >
                                        <IconCheck
                                          size={13}
                                        />

                                        <Text
                                          size="xs"
                                          fw={700}
                                        >
                                          Selected
                                        </Text>
                                      </Group>
                                    )}
                                  </Stack>
                                </Button>
                              </motion.div>
                            )
                          },
                        )}
                      </SimpleGrid>

                      {/* =============================================
                          EMPTY STATE
                      ============================================= */}

                      {timeSlots.length === 0 && (
                        <Card
                          radius="xl"
                          padding="xl"
                          withBorder
                          style={{
                            background:
                              'var(--mantine-color-gray-0)',
                          }}
                        >
                          <Stack
                            align="center"
                            gap="sm"
                          >
                            <ThemeIcon
                              size={64}
                              radius="xl"
                              variant="light"
                              color="gray"
                            >
                              <IconClock
                                size={30}
                              />
                            </ThemeIcon>

                            <Text
                              fw={800}
                              size="lg"
                            >
                              No appointment times
                              available
                            </Text>

                            <Text
                              size="sm"
                              c="dimmed"
                              ta="center"
                              maw={420}
                            >
                              There aren't any available
                              appointment times for this
                              date. Please go back and
                              choose another date.
                            </Text>
                          </Stack>
                        </Card>
                      )}

                      {/* =============================================
                          BOOKED NOTICE
                      ============================================= */}

                      {bookedTimes.length > 0 && (
                        <Text
                          size="sm"
                          c="dimmed"
                          ta="center"
                        >
                          Times marked as{' '}
                          <Text
                            component="span"
                            fw={700}
                          >
                            Booked
                          </Text>{' '}
                          are no longer available.
                        </Text>
                      )}
                    </>
                  )}
                </Stack>
              </Paper>
            </motion.div>

            {/* =====================================================
                SELECTED TIME
            ===================================================== */}

            <motion.div
              initial={false}
              animate={{
                opacity: selectedTime ? 1 : 0.55,
                scale: selectedTime ? 1 : 0.98,
              }}
              transition={{
                duration: 0.3,
              }}
            >
              <Card
                radius="xl"
                padding="xl"
                withBorder
                style={{
                  background: selectedTime
                    ? 'var(--mantine-color-smilehaos-0)'
                    : 'var(--mantine-color-gray-0)',
                  borderColor: selectedTime
                    ? 'var(--mantine-color-smilehaos-2)'
                    : 'var(--mantine-color-gray-2)',
                  transition:
                    'background-color 200ms ease, border-color 200ms ease',
                }}
              >
                <Flex
                  justify="space-between"
                  align="center"
                  gap="lg"
                  direction={{
                    base: 'column',
                    sm: 'row',
                  }}
                >
                  <Group
                    gap="md"
                    align="center"
                  >
                    <ThemeIcon
                      size={58}
                      radius="lg"
                      color="smilehaos"
                      variant={
                        selectedTime
                          ? 'filled'
                          : 'light'
                      }
                    >
                      <IconClock size={28} />
                    </ThemeIcon>

                    <Stack gap={3}>
                      <Text
                        size="xs"
                        fw={800}
                        tt="uppercase"
                        c={
                          selectedTime
                            ? 'smilehaos.7'
                            : 'dimmed'
                        }
                        style={{
                          letterSpacing: '0.12em',
                        }}
                      >
                        {selectedTime
                          ? 'Your appointment time'
                          : 'No time selected'}
                      </Text>

                      <Text
                        fw={800}
                        size="clamp(1.3rem, 4vw, 2rem)"
                      >
                        {selectedTime
                          ? selectedTime
                          : 'Choose a time above'}
                      </Text>
                    </Stack>
                  </Group>

                  {selectedTime && (
                    <Badge
                      size="xl"
                      radius="xl"
                      color="smilehaos"
                      variant="filled"
                      leftSection={
                        <IconCheck size={15} />
                      }
                    >
                      Perfect!
                    </Badge>
                  )}
                </Flex>
              </Card>
            </motion.div>

            <Divider />

            {/* =====================================================
                NAVIGATION
            ===================================================== */}

            <Flex
              justify="space-between"
              align="center"
              gap="md"
              direction={{
                base: 'column-reverse',
                sm: 'row',
              }}
            >
              <motion.div
                whileHover={{
                  x: -3,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                style={{
                  width: '100%',
                  maxWidth: 180,
                }}
              >
                <Button
                  variant="subtle"
                  size="lg"
                  radius="md"
                  fullWidth
                  leftSection={
                    <IconArrowLeft size={18} />
                  }
                  onClick={onBack}
                >
                  Back
                </Button>
              </motion.div>

              <motion.div
                whileHover={
                  selectedTime &&
                  !isLoadingBookedTimes
                    ? {
                        scale: 1.025,
                      }
                    : undefined
                }
                whileTap={
                  selectedTime &&
                  !isLoadingBookedTimes
                    ? {
                        scale: 0.97,
                      }
                    : undefined
                }
                style={{
                  width: '100%',
                  maxWidth: 280,
                }}
              >
                <Button
                  size="lg"
                  radius="xl"
                  fullWidth
                  disabled={
                    !selectedTime ||
                    isLoadingBookedTimes
                  }
                  onClick={onContinue}
                  rightSection={
                    <IconArrowRight size={19} />
                  }
                  style={{
                    boxShadow:
                      selectedTime &&
                      !isLoadingBookedTimes
                        ? '0 12px 30px rgba(0, 0, 0, 0.12)'
                        : undefined,
                  }}
                >
                  Continue to details
                </Button>
              </motion.div>
            </Flex>
          </Stack>
        </Container>
      </main>
    </>
  )
}

export default TimeSelection
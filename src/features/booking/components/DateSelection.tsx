import {
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { motion } from 'motion/react'
import {
  IconArrowLeft,
  IconArrowRight,
  IconCalendarHeart,
  IconCheck,
  IconClock,
  IconSparkles,
} from '@tabler/icons-react'

import BookingHeader from './BookingHeader'
import type { Service } from '../../services/types/service.types'

type DateSelectionProps = {
  selectedService: Service | null
  selectedDate: string | null
  onDateChange: (date: string | null) => void
  onBack: () => void
  onContinue: () => void
  isDateClosed: (date: string) => boolean
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

function DateSelection({
  selectedService,
  selectedDate,
  onDateChange,
  onBack,
  onContinue,
  isDateClosed,
}: DateSelectionProps) {
  const formattedDate = selectedDate
    ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
      'en-US',
      {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      },
    )
    : null

  const shortDate = selectedDate
    ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
      },
    )
    : null

  return (
    <>
      <BookingHeader step={2} totalSteps={4} />

      <main
        style={{
          overflow: 'hidden',
          background:
            'linear-gradient(180deg, var(--mantine-color-gray-0) 0%, #ffffff 45%, var(--mantine-color-smilehaos-0) 100%)',
        }}
      >
        {/* =====================================================
            HERO
        ===================================================== */}

        <Container
          size="lg"
          py={{ base: 32, sm: 60 }}
        >
          <Stack gap={32}>
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
                    leftSection={<IconSparkles size={14} />}
                  >
                    Step 2 · Pick your moment
                  </Badge>

                  {selectedDate && (
                    <Badge
                      color="smilehaos"
                      variant="filled"
                      size="lg"
                      radius="xl"
                      leftSection={<IconCheck size={14} />}
                    >
                      Date selected
                    </Badge>
                  )}
                </Group>

                <Title
                  order={1}
                  size="clamp(2.8rem, 7vw, 5.5rem)"
                  style={{
                    maxWidth: 900,
                    lineHeight: 0.98,
                    letterSpacing: '-0.055em',
                  }}
                >
                  Your smile has a date
                  <Text
                    component="span"
                    inherit
                    c="smilehaos.6"
                  >
                    .
                  </Text>
                </Title>

                <Text
                  size="xl"
                  c="dimmed"
                  maw={650}
                  style={{
                    lineHeight: 1.6,
                  }}
                >
                  Choose a day that works for you. We'll
                  take care of the rest.
                </Text>
              </Stack>
            </motion.div>

            {/* =================================================
                SELECTED SERVICE FLOATING CARD
            ================================================= */}

            {selectedService && (
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
                        {selectedService.icon}
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
                          You're booking
                        </Text>

                        <Text
                          fw={800}
                          size="lg"
                        >
                          {selectedService.name}
                        </Text>

                        <Group
                          gap="xs"
                          c="dimmed"
                        >
                          <IconClock size={15} />

                          <Text size="sm">
                            {selectedService.duration}{' '}
                            minutes
                          </Text>

                          <Text size="sm">·</Text>

                          <Text
                            size="sm"
                            fw={700}
                            c="smilehaos.7"
                          >
                            {selectedService.priceLabel ||
                              `₱${selectedService.price.toLocaleString()}`}
                          </Text>
                        </Group>
                      </Stack>
                    </Group>

                    <ThemeIcon
                      variant="light"
                      color="smilehaos"
                      size={40}
                      radius="xl"
                    >
                      <IconCheck size={20} />
                    </ThemeIcon>
                  </Group>
                </Card>
              </motion.div>
            )}

            {/* =================================================
                DATE PICKER AREA
            ================================================= */}

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{
                duration: 0.6,
                delay: 0.18,
                ease: 'easeOut',
              }}
            >
              <Paper
                radius={32}
                p={{ base: 'md', sm: 32 }}
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
                {/* Decorative blob */}

                <motion.div
                  animate={{
                    rotate: [0, 8, 0],
                    scale: [1, 1.04, 1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    position: 'absolute',
                    width: 220,
                    height: 220,
                    borderRadius: '50%',
                    background:
                      'var(--mantine-color-smilehaos-0)',
                    right: -90,
                    top: -100,
                    pointerEvents: 'none',
                  }}
                />

                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, -4, 0],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    position: 'absolute',
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    background:
                      'var(--mantine-color-smilehaos-1)',
                    left: -70,
                    bottom: -70,
                    pointerEvents: 'none',
                  }}
                />

                <Stack
                  align="center"
                  gap="xl"
                  style={{
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <Stack
                    align="center"
                    gap="xs"
                  >
                    <ThemeIcon
                      size={58}
                      radius="xl"
                      variant="light"
                      color="smilehaos"
                    >
                      <IconCalendarHeart
                        size={30}
                      />
                    </ThemeIcon>

                    <Title
                      order={2}
                      size="clamp(1.5rem, 4vw, 2.2rem)"
                      ta="center"
                      style={{
                        letterSpacing: '-0.035em',
                      }}
                    >
                      Find your perfect day
                    </Title>

                    <Text
                      size="sm"
                      c="dimmed"
                      ta="center"
                    >
                      Available dates are ready for you
                      below.
                    </Text>
                  </Stack>

                  <DatePicker
                    value={selectedDate}
                    onChange={onDateChange}
                    minDate={
                      new Date()
                        .toISOString()
                        .split('T')[0]
                    }
                    excludeDate={isDateClosed}
                    size="md"
                  />

                  <Text
                    size="sm"
                    c="dimmed"
                    ta="center"
                    maw={420}
                  >
                    Sundays and clinic closed dates are
                    unavailable. Select any available date
                    to continue.
                  </Text>
                </Stack>
              </Paper>
            </motion.div>

            {/* =================================================
                SELECTED DATE HERO
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: selectedDate ? 1 : 0.55,
                scale: 1,
              }}
              transition={{
                duration: 0.35,
              }}
            >
              <Card
                radius="xl"
                padding="xl"
                withBorder
                style={{
                  background: selectedDate
                    ? 'var(--mantine-color-smilehaos-0)'
                    : 'var(--mantine-color-gray-0)',
                  borderColor: selectedDate
                    ? 'var(--mantine-color-smilehaos-2)'
                    : 'var(--mantine-color-gray-2)',
                  transition:
                    'background-color 200ms ease, border-color 200ms ease',
                }}
              >
                <Flex
                  direction={{
                    base: 'column',
                    sm: 'row',
                  }}
                  align={{
                    base: 'flex-start',
                    sm: 'center',
                  }}
                  justify="space-between"
                  gap="lg"
                >
                  <Group
                    gap="md"
                    align="center"
                  >
                    <ThemeIcon
                      size={56}
                      radius="lg"
                      color="smilehaos"
                      variant={
                        selectedDate
                          ? 'filled'
                          : 'light'
                      }
                    >
                      <IconCalendarHeart
                        size={28}
                      />
                    </ThemeIcon>

                    <Stack gap={3}>
                      <Text
                        size="xs"
                        fw={800}
                        tt="uppercase"
                        c={
                          selectedDate
                            ? 'smilehaos.7'
                            : 'dimmed'
                        }
                        style={{
                          letterSpacing: '0.12em',
                        }}
                      >
                        {selectedDate
                          ? 'Your appointment date'
                          : 'No date selected'}
                      </Text>

                      <Text
                        fw={800}
                        size="xl"
                      >
                        {selectedDate
                          ? formattedDate
                          : 'Choose a date above'}
                      </Text>
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
                </Flex>
              </Card>
            </motion.div>

            <Divider />

            {/* =================================================
    NAVIGATION
================================================= */}

            <Flex
              direction={{
                base: 'column-reverse',
                sm: 'row',
              }}
              align="center"
              justify="space-between"
              gap="md"
              style={{
                width: '100%',
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
                  maxWidth: 240,
                }}
              >
                <Button
                  variant="subtle"
                  size="lg"
                  radius="md"
                  leftSection={
                    <IconArrowLeft size={18} />
                  }
                  onClick={onBack}
                  fullWidth
                >
                  Back
                </Button>
              </motion.div>

              <motion.div
                whileHover={
                  selectedDate
                    ? {
                      scale: 1.025,
                    }
                    : undefined
                }
                whileTap={
                  selectedDate
                    ? {
                      scale: 0.97,
                    }
                    : undefined
                }
                style={{
                  width: '100%',
                  maxWidth: 240,
                }}
              >
                <Button
                  size="lg"
                  radius="xl"
                  fullWidth
                  disabled={!selectedDate}
                  onClick={onContinue}
                  rightSection={
                    <IconArrowRight size={19} />
                  }
                  style={{
                    boxShadow: selectedDate
                      ? '0 12px 30px rgba(0, 0, 0, 0.12)'
                      : undefined,
                  }}
                >
                  Choose this date
                </Button>
              </motion.div>
            </Flex>
          </Stack>
        </Container>
      </main>
    </>
  )
}

export default DateSelection
import {
  Anchor,
  Box,
  Container,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { motion } from 'motion/react'
import {
  IconCalendar,
  IconCheck,
  IconClock,
  IconSparkles,
  IconUser,
} from '@tabler/icons-react'

type BookingHeaderProps = {
  step: number
  totalSteps: number
}

const steps = [
  {
    number: 1,
    label: 'Service',
    icon: IconSparkles,
  },
  {
    number: 2,
    label: 'Date',
    icon: IconCalendar,
  },
  {
    number: 3,
    label: 'Time',
    icon: IconClock,
  },
  {
    number: 4,
    label: 'Details',
    icon: IconUser,
  },
]

function BookingHeader({
  step,
  totalSteps,
}: BookingHeaderProps) {
  const progress =
    totalSteps > 1
      ? ((step - 1) / (totalSteps - 1)) * 100
      : 100

  return (
    <Box
      component="header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background:
          'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(18px)',
        borderBottom:
          '1px solid var(--mantine-color-gray-2)',
      }}
    >
      <Container
        size="lg"
        py="md"
      >
        <Stack gap="md">
          {/* =====================================================
              TOP BAR
          ===================================================== */}

          <Flex
            justify="space-between"
            align="center"
            gap="md"
          >
            {/* BRAND */}

            <Anchor
              href="/"
              underline="never"
              c="inherit"
            >
              <Group gap="sm">
                <motion.div
                  whileHover={{
                    rotate: -8,
                    scale: 1.08,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                >
                  <ThemeIcon
                    variant="light"
                    color="smilehaos"
                    size={44}
                    radius="xl"
                  >
                    🦷
                  </ThemeIcon>
                </motion.div>

                <Stack gap={0}>
                  <Text
                    fw={900}
                    size="lg"
                    style={{
                      letterSpacing: '-0.03em',
                    }}
                  >
                    SmileHaos
                  </Text>

                  <Text
                    size="xs"
                    c="dimmed"
                    visibleFrom="sm"
                  >
                    Dental Clinic
                  </Text>
                </Stack>
              </Group>
            </Anchor>

            {/* STEP COUNTER */}

            <Paper
              radius="xl"
              px="md"
              py={7}
              withBorder
              style={{
                background:
                  'var(--mantine-color-gray-0)',
              }}
            >
              <Group
                gap="xs"
                wrap="nowrap"
              >
                <Text
                  fw={900}
                  size="sm"
                  c="smilehaos.7"
                >
                  {step}
                </Text>

                <Text
                  size="sm"
                  c="dimmed"
                >
                  / {totalSteps}
                </Text>

                <Text
                  size="sm"
                  c="dimmed"
                  visibleFrom="sm"
                >
                  {step === totalSteps
                    ? 'Almost done'
                    : 'Booking'}
                </Text>
              </Group>
            </Paper>
          </Flex>

          {/* =====================================================
              PROGRESS
          ===================================================== */}

          <Box
            style={{
              position: 'relative',
              height: 54,
            }}
          >
            {/* Connecting track */}

            <Box
              style={{
                position: 'absolute',
                top: 16,
                left: 24,
                right: 24,
                height: 3,
                borderRadius: 999,
                background:
                  'var(--mantine-color-gray-2)',
              }}
            />

            {/* Animated progress */}

            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: `${progress}%`,
              }}
              transition={{
                duration: 0.7,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                top: 16,
                left: 24,
                height: 3,
                borderRadius: 999,
                background:
                  'var(--mantine-color-smilehaos-5)',
              }}
            />

            {/* Steps */}

            <Flex
              justify="space-between"
              align="flex-start"
              style={{
                position: 'relative',
              }}
            >
              {steps
                .slice(0, totalSteps)
                .map((item) => {
                  const isActive =
                    item.number === step

                  const isCompleted =
                    item.number < step

                  const Icon = item.icon

                  return (
                    <Stack
                      key={item.number}
                      align="center"
                      gap={5}
                      style={{
                        width: 70,
                      }}
                    >
                      <motion.div
                        initial={false}
                        animate={{
                          scale: isActive
                            ? 1.08
                            : 1,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <ThemeIcon
                          size={34}
                          radius="50%"
                          color={
                            isActive ||
                            isCompleted
                              ? 'smilehaos'
                              : 'gray'
                          }
                          variant={
                            isActive ||
                            isCompleted
                              ? 'filled'
                              : 'light'
                          }
                          style={{
                            border:
                              isActive
                                ? '3px solid var(--mantine-color-smilehaos-2)'
                                : undefined,
                            boxShadow:
                              isActive
                                ? '0 5px 18px rgba(0, 0, 0, 0.12)'
                                : undefined,
                          }}
                        >
                          {isCompleted ? (
                            <IconCheck
                              size={17}
                              stroke={2.8}
                            />
                          ) : (
                            <Icon size={17} />
                          )}
                        </ThemeIcon>
                      </motion.div>

                      <Text
                        size="xs"
                        fw={
                          isActive
                            ? 800
                            : 600
                        }
                        c={
                          isActive
                            ? 'smilehaos.7'
                            : isCompleted
                              ? 'dark'
                              : 'dimmed'
                        }
                        visibleFrom="sm"
                      >
                        {item.label}
                      </Text>
                    </Stack>
                  )
                })}
            </Flex>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default BookingHeader
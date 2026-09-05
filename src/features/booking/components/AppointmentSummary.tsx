import {
  Badge,
  Card,
  Divider,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { motion } from 'motion/react'
import {
  IconCalendar,
  IconClock,
  IconSparkles,
} from '@tabler/icons-react'

import type { Service } from '../../services/types/service.types'

type AppointmentSummaryProps = {
  selectedService: Service | null
  selectedDate: string | null
  selectedTime: string | null
}

function AppointmentSummary({
  selectedService,
  selectedDate,
  selectedTime,
}: AppointmentSummaryProps) {
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

  return (
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
        duration: 0.5,
      }}
      whileHover={{
        y: -3,
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
            '0 25px 70px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* =====================================================
            DECORATIVE ORB
        ===================================================== */}

        <motion.div
          animate={{
            rotate: [0, 8, 0],
            scale: [1, 1.08, 1],
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
            right: -120,
            top: -130,
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
          >
            <Group gap="md">
              <ThemeIcon
                size={54}
                radius="xl"
                variant="light"
                color="smilehaos"
              >
                <IconSparkles size={27} />
              </ThemeIcon>

              <Stack gap={2}>
                <Text
                  fw={800}
                  size="lg"
                >
                  Your appointment
                </Text>

                <Text
                  size="sm"
                  c="dimmed"
                >
                  Here's what you've selected
                </Text>
              </Stack>
            </Group>

            <Badge
              color="smilehaos"
              variant="light"
              radius="xl"
              size="lg"
            >
              {selectedService
                ? 'Selected'
                : 'Start booking'}
            </Badge>
          </Flex>

          <Divider />

          {/* =================================================
              SERVICE
          ================================================= */}

          {selectedService && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 0.1,
              }}
            >
              <Card
                radius="xl"
                padding="lg"
                style={{
                  background:
                    'var(--mantine-color-smilehaos-0)',
                  border:
                    '1px solid var(--mantine-color-smilehaos-2)',
                }}
              >
                <Flex
                  justify="space-between"
                  align="center"
                  gap="lg"
                  wrap="wrap"
                >
                  <Group gap="md">
                    <ThemeIcon
                      variant="filled"
                      color="smilehaos"
                      size={58}
                      radius="lg"
                    >
                      {selectedService.icon}
                    </ThemeIcon>

                    <Stack gap={3}>
                      <Text
                        size="xs"
                        c="dimmed"
                        tt="uppercase"
                        fw={700}
                        style={{
                          letterSpacing:
                            '0.08em',
                        }}
                      >
                        Service
                      </Text>

                      <Text
                        fw={900}
                        size="xl"
                      >
                        {selectedService.name}
                      </Text>

                      <Text
                        size="sm"
                        c="dimmed"
                      >
                        {selectedService.duration}{' '}
                        minutes
                      </Text>
                    </Stack>
                  </Group>

                  <Stack
                    gap={2}
                    align="flex-end"
                  >
                    <Text
                      size="xs"
                      c="dimmed"
                      tt="uppercase"
                      fw={700}
                    >
                      Price
                    </Text>

                    <Text
                      fw={900}
                      size="xl"
                      c="smilehaos.7"
                    >
                      {selectedService.priceLabel ??
                        'Consultation required'}
                    </Text>
                  </Stack>
                </Flex>
              </Card>
            </motion.div>
          )}

          {/* =================================================
              DATE + TIME
          ================================================= */}

          <SimpleGrid
            cols={{
              base: 1,
              xs: 2,
            }}
            spacing="md"
          >
            {/* DATE */}

            <motion.div
              initial={{
                opacity: 0,
                x: -12,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.15,
              }}
            >
              <Card
                withBorder
                radius="xl"
                padding="lg"
                h="100%"
              >
                <Stack gap="sm">
                  <Group gap="xs">
                    <ThemeIcon
                      size={34}
                      radius="md"
                      variant="light"
                      color="smilehaos"
                    >
                      <IconCalendar
                        size={18}
                      />
                    </ThemeIcon>

                    <Text
                      size="xs"
                      c="dimmed"
                      fw={800}
                      tt="uppercase"
                    >
                      Date
                    </Text>
                  </Group>

                  <Text
                    fw={700}
                    size="md"
                    lh={1.4}
                  >
                    {formattedDate}
                  </Text>
                </Stack>
              </Card>
            </motion.div>

            {/* TIME */}

            <motion.div
              initial={{
                opacity: 0,
                x: 12,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.2,
              }}
            >
              <Card
                withBorder
                radius="xl"
                padding="lg"
                h="100%"
              >
                <Stack gap="sm">
                  <Group gap="xs">
                    <ThemeIcon
                      size={34}
                      radius="md"
                      variant="light"
                      color="smilehaos"
                    >
                      <IconClock size={18} />
                    </ThemeIcon>

                    <Text
                      size="xs"
                      c="dimmed"
                      fw={800}
                      tt="uppercase"
                    >
                      Time
                    </Text>
                  </Group>

                  <Text
                    fw={700}
                    size="md"
                  >
                    {selectedTime ||
                      'No time selected'}
                  </Text>
                </Stack>
              </Card>
            </motion.div>
          </SimpleGrid>

          <Divider />

          {/* =================================================
              PRICE SUMMARY
          ================================================= */}

          <Flex
            justify="space-between"
            align="center"
            gap="md"
          >
            <Stack gap={2}>
              <Text
                fw={700}
                size="md"
              >
                Estimated total
              </Text>

              <Text
                size="xs"
                c="dimmed"
              >
                Final price confirmed by the clinic
              </Text>
            </Stack>

            <Text
              fw={900}
              size="1.6rem"
              c="smilehaos.7"
              ta="right"
            >
              {selectedService?.priceLabel ??
                'Consultation required'}
            </Text>
          </Flex>
        </Stack>
      </Paper>
    </motion.div>
  )
}

export default AppointmentSummary
import {
  Badge,
  Card,
  Group,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { motion } from 'motion/react'

import type { Service } from '../../services/types/service.types'

type ServiceCardProps = {
  service: Service
  selected: boolean
  onSelect: () => void
}

function ServiceCard({
  service,
  selected,
  onSelect,
}: ServiceCardProps) {
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault()
      onSelect()
    }
  }

  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      whileTap={{
        scale: 0.99,
      }}
      transition={{
        duration: 0.2,
        ease: 'easeOut',
      }}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <Card
        padding="xl"
        radius="xl"
        withBorder
        onClick={onSelect}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        style={{
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          height: '100%',

          borderColor: selected
            ? 'var(--mantine-color-smilehaos-6)'
            : 'var(--mantine-color-gray-3)',

          backgroundColor: selected
            ? 'var(--mantine-color-smilehaos-0)'
            : 'var(--mantine-color-white)',

          boxShadow: selected
            ? '0 10px 30px rgba(0, 0, 0, 0.08)'
            : '0 4px 18px rgba(0, 0, 0, 0.04)',

          transition:
            'border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease',
        }}
      >
        {/* =====================================================
            SELECTED INDICATOR
        ===================================================== */}

        <motion.div
          initial={false}
          animate={{
            scale: selected ? 1 : 0.8,
            opacity: selected ? 1 : 0,
          }}
          transition={{
            duration: 0.2,
          }}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2,
          }}
        >
          <Badge
            color="smilehaos"
            variant="filled"
            size="sm"
            radius="xl"
          >
            ✓ Selected
          </Badge>
        </motion.div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <Stack
          gap="lg"
          h="100%"
        >
          {/* =================================================
              TOP ROW
          ================================================= */}

          <Group
            justify="space-between"
            align="flex-start"
            wrap="nowrap"
            style={{
              width: '100%',
            }}
          >
            <motion.div
              animate={{
                scale: selected
                  ? [1, 1.06, 1]
                  : 1,
              }}
              transition={{
                duration: 0.35,
                ease: 'easeOut',
              }}
            >
              <ThemeIcon
                size={56}
                radius="lg"
                variant={
                  selected
                    ? 'filled'
                    : 'light'
                }
                color="smilehaos"
                style={{
                  flexShrink: 0,
                }}
              >
                {service.icon}
              </ThemeIcon>
            </motion.div>

            {/* Price */}

            <Stack
              gap={2}
              align="flex-end"
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <Text
                size="xs"
                fw={700}
                c="dimmed"
                ta="right"
                style={{
                  letterSpacing: '0.08em',
                }}
              >
                PRICE
              </Text>

              <Text
                size="xl"
                fw={800}
                c={
                  selected
                    ? 'smilehaos.7'
                    : 'gray.9'
                }
                ta="right"
                lh={1.2}
                style={{
                  transition:
                    'color 180ms ease',
                  whiteSpace: 'normal',
                  overflowWrap: 'anywhere',
                  maxWidth: '100%',
                }}
              >
                {service.priceLabel ||
                  'Consultation required'}
              </Text>
            </Stack>
          </Group>

          {/* =================================================
              SERVICE INFORMATION
          ================================================= */}

          <Stack
            gap="xs"
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Text
              fw={700}
              size="lg"
              lh={1.25}
            >
              {service.name}
            </Text>

            <Text
              size="sm"
              c="dimmed"
              lh={1.6}
              lineClamp={2}
            >
              {service.description}
            </Text>
          </Stack>

          {/* =================================================
              DURATION
          ================================================= */}

          <Group
            justify="space-between"
            wrap="nowrap"
          >
            <Badge
              color="smilehaos"
              variant="light"
              radius="xl"
              size="sm"
            >
              {service.duration} min
            </Badge>

            <Text
              size="xs"
              fw={600}
              c="dimmed"
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              Select service
            </Text>
          </Group>
        </Stack>
      </Card>
    </motion.div>
  )
}

export default ServiceCard
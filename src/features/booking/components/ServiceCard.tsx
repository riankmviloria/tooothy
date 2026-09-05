import {
  Card,
  Group,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core'

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
  return (
    <Card
      padding="lg"
      radius="lg"
      withBorder
      onClick={onSelect}
      style={{
        cursor: 'pointer',
        borderColor: selected
          ? 'var(--mantine-color-smilehaos-6)'
          : undefined,
        backgroundColor: selected
          ? 'var(--mantine-color-smilehaos-0)'
          : undefined,
        transition: 'all 150ms ease',
      }}
    >
      <Group
        align="flex-start"
        wrap="nowrap"
      >
        <ThemeIcon
          size={52}
          radius="md"
          variant="light"
          color="smilehaos"
          style={{ flexShrink: 0 }}
        >
          {service.icon}
        </ThemeIcon>

        <Stack
          gap={6}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Text
            fw={700}
            size="lg"
          >
            {service.name}
          </Text>

          <Text
            size="sm"
            c="dimmed"
            lh={1.5}
          >
            {service.description}
          </Text>

          <Text
            size="sm"
            fw={600}
            c="smilehaos.7"
            mt={4}
          >
            {service.duration} minutes
          </Text>
        </Stack>

        <Stack
          gap={2}
          align="flex-end"
          style={{
            width: 150,
            flexShrink: 0,
          }}
        >
          <Text
            size="xs"
            fw={600}
            c="dimmed"
          >
            PRICE
          </Text>

          <Text
            size="lg"
            fw={800}
            c="gray.9"
            ta="right"
            lh={1.25}
          >
            {service.priceLabel || 'Consultation required'}
          </Text>

        </Stack>
      </Group>
    </Card>
  )
}

export default ServiceCard

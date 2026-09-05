import {
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core'

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
  return (
    <Card
      withBorder
      radius="xl"
      padding="xl"
    >
      <Stack gap="lg">
        <Text
          fw={700}
          size="lg"
        >
          Your appointment
        </Text>

        <Group>
          <ThemeIcon
            variant="light"
            color="smilehaos"
            size={48}
            radius="md"
          >
            {selectedService?.icon}
          </ThemeIcon>

          <Stack gap={2}>
            <Text fw={700}>
              {selectedService?.name}
            </Text>

            <Text
              size="sm"
              c="dimmed"
            >
              {selectedService?.duration} minutes
            </Text>
          </Stack>
        </Group>

        <SimpleGrid
          cols={{
            base: 1,
            xs: 2,
          }}
        >
          <Card
            withBorder
            radius="md"
            padding="md"
          >
            <Text
              size="xs"
              c="dimmed"
            >
              DATE
            </Text>

            <Text fw={600}>
              {selectedDate
                ? new Date(
                    `${selectedDate}T00:00:00`,
                  ).toLocaleDateString(
                    'en-US',
                    {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    },
                  )
                : 'No date selected'}
            </Text>
          </Card>

          <Card
            withBorder
            radius="md"
            padding="md"
          >
            <Text
              size="xs"
              c="dimmed"
            >
              TIME
            </Text>

            <Text fw={600}>
              {selectedTime}
            </Text>
          </Card>
        </SimpleGrid>

        <Group justify="space-between">
          <Text c="dimmed">
            Price
          </Text>

          <Text
            fw={800}
            size="xl"
            c="smilehaos.7"
            ta="right"
          >
            {selectedService?.priceLabel ??
              'Consultation required'}
          </Text>
        </Group>
      </Stack>
    </Card>
  )
}

export default AppointmentSummary
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'

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

function DateSelection({
  selectedService,
  selectedDate,
  onDateChange,
  onBack,
  onContinue,
  isDateClosed,
}: DateSelectionProps) {
  return (
    <>
      <BookingHeader step={2} totalSteps={4} />

      <main>
        <Container
          size="sm"
          py={{ base: 'xl', sm: 60 }}
        >
          <Stack gap="xl">
            <Stack gap="xs">
              <Badge
                color="smilehaos"
                variant="light"
                w="fit-content"
              >
                Step 2
              </Badge>

              <Title
                order={1}
                size="clamp(2.2rem, 6vw, 3.5rem)"
                style={{
                  letterSpacing: '-0.04em',
                }}
              >
                When would you like to visit?
              </Title>

              <Text
                size="lg"
                c="dimmed"
              >
                Choose a date that works for you.
              </Text>
            </Stack>

            {selectedService && (
              <Card
                withBorder
                radius="lg"
                padding="md"
              >
                <Group>
                  <ThemeIcon
                    variant="light"
                    color="smilehaos"
                    size={44}
                    radius="md"
                  >
                    {selectedService.icon}
                  </ThemeIcon>

                  <Stack gap={2}>
                    <Text fw={700}>
                      {selectedService.name}
                    </Text>

                    <Text
                      size="sm"
                      c="dimmed"
                    >
                      {selectedService.duration}
                      {' minutes · '}
                      {selectedService.priceLabel ||
                        `₱${selectedService.price.toLocaleString()}`}
                    </Text>
                  </Stack>
                </Group>
              </Card>
            )}

            <Card
              withBorder
              radius="xl"
              padding="xl"
            >
              <Stack align="center">
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
                >
                  Sundays and selected closed dates are
                  unavailable.
                </Text>
              </Stack>
            </Card>

            <Group justify="space-between">
              <Button
                variant="subtle"
                size="lg"
                onClick={onBack}
              >
                Back
              </Button>

              <Button
                size="lg"
                disabled={!selectedDate}
                onClick={onContinue}
              >
                Continue
              </Button>
            </Group>
          </Stack>
        </Container>
      </main>
    </>
  )
}

export default DateSelection
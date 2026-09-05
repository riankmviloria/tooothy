import {
  Badge,
  Button,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'

import ServiceCard from './ServiceCard'
import type { Service } from '../../services/types/service.types'
import BookingHeader from './BookingHeader'

type ServiceSelectionProps = {
  services: Service[]
  selectedService: Service | null
  onSelect: (service: Service) => void
  onContinue: () => void
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
                Step 1
              </Badge>

              <Title
                order={1}
                size="clamp(2.2rem, 6vw, 3.5rem)"
                style={{
                  letterSpacing: '-0.04em',
                }}
              >
                What can we help you with?
              </Title>

              <Text
                size="lg"
                c="dimmed"
              >
                Select the dental service you'd like
                to book.
              </Text>
            </Stack>

            <SimpleGrid
              cols={{ base: 1 }}
              spacing="md"
            >
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  selected={
                    selectedService?.id === service.id
                  }
                  onSelect={() => onSelect(service)}
                />
              ))}
            </SimpleGrid>

            <Group
              justify="flex-end"
              mt="md"
            >
              <Button
                size="lg"
                radius="md"
                disabled={!selectedService}
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

export default ServiceSelection
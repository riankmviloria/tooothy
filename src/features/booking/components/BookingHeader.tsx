import {
  Anchor,
  Container,
  Group,
  Text,
  ThemeIcon,
} from '@mantine/core'

type BookingHeaderProps = {
  step: number
  totalSteps: number
}

function BookingHeader({
  step,
  totalSteps,
}: BookingHeaderProps) {
  return (
    <Container size="sm">
      <Group
        justify="space-between"
        py="lg"
      >
        <Anchor
          href="/"
          underline="never"
          c="inherit"
        >
          <Group gap="sm">
            <ThemeIcon
              variant="light"
              color="smilehaos"
              size={40}
              radius="md"
            >
              🦷
            </ThemeIcon>

            <Text
              fw={800}
              size="lg"
            >
              SmileHaos
            </Text>
          </Group>
        </Anchor>

        <Text
          size="sm"
          c="dimmed"
        >
          Step {step} of {totalSteps}
        </Text>
      </Group>
    </Container>
  )
}

export default BookingHeader
import {
  Anchor,
  Button,
  Container,
  Group,
} from '@mantine/core'

import Brand from './Brand'

function Header() {
  return (
    <header>
      <Container size="lg">
        <Group
          justify="space-between"
          py="md"
        >
          {/* Brand */}
          <Anchor
            href="/"
            underline="never"
          >
            <Brand compact />
          </Anchor>

          {/* Desktop Navigation */}
          <Group
            gap="xl"
            visibleFrom="sm"
          >
            <Anchor
              href="#services"
              underline="never"
              c="dark"
              fw={500}
            >
              Services
            </Anchor>

            <Anchor
              href="#how-it-works"
              underline="never"
              c="dark"
              fw={500}
            >
              How it works
            </Anchor>

            <Button
              component="a"
              href="/book"
              radius="md"
            >
              Book an appointment
            </Button>
          </Group>

          {/* Mobile */}
          <Button
            component="a"
            href="/book"
            hiddenFrom="sm"
            size="sm"
            radius="md"
          >
            Book
          </Button>
        </Group>
      </Container>
    </header>
  )
}

export default Header
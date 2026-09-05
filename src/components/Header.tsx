import {
  Anchor,
  Box,
  Button,
  Container,
  Group,
} from '@mantine/core'

import Brand from './Brand'

function Header() {
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
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom:
          '1px solid var(--mantine-color-gray-2)',
      }}
    >
      <Container size="lg">
        <Group
          justify="space-between"
          py="md"
        >
          {/* =====================================================
              BRAND
          ===================================================== */}

          <Anchor
            href="/"
            underline="never"
          >
            <Brand compact />
          </Anchor>

          {/* =====================================================
              DESKTOP NAVIGATION
          ===================================================== */}

          <Group
            gap="xl"
            visibleFrom="sm"
          >
            <Anchor
              href="#services"
              underline="never"
              c="dark"
              fw={600}
              fz="sm"
              style={{
                transition:
                  'color 150ms ease',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.color =
                  'var(--mantine-color-smilehaos-6)'
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.color =
                  'var(--mantine-color-dark-9)'
              }}
            >
              Services
            </Anchor>

            <Anchor
              href="#how-it-works"
              underline="never"
              c="dark"
              fw={600}
              fz="sm"
              style={{
                transition:
                  'color 150ms ease',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.color =
                  'var(--mantine-color-smilehaos-6)'
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.color =
                  'var(--mantine-color-dark-9)'
              }}
            >
              How it works
            </Anchor>

            <Button
              component="a"
              href="/book"
              radius="xl"
              size="md"
              style={{
                boxShadow:
                  '0 8px 24px rgba(0, 0, 0, 0.10)',
              }}
            >
              Book an appointment
            </Button>
          </Group>

          {/* =====================================================
              MOBILE
          ===================================================== */}

          <Button
            component="a"
            href="/book"
            hiddenFrom="sm"
            size="sm"
            radius="xl"
          >
            Book
          </Button>
        </Group>
      </Container>
    </Box>
  )
}

export default Header
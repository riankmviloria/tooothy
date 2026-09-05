import {
  Badge,
  Card,
  Divider,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { motion } from 'motion/react'
import {
  IconCheck,
  IconMail,
  IconNotes,
  IconPhone,
  IconSparkles,
  IconUser,
} from '@tabler/icons-react'

type PatientDetailsProps = {
  fullName: string
  phone: string
  email: string
  notes: string
  onFullNameChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onEmailChange: (value: string) => void
  onNotesChange: (value: string) => void
}

const fieldVariants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
}

function PatientDetails({
  fullName,
  phone,
  email,
  notes,
  onFullNameChange,
  onPhoneChange,
  onEmailChange,
  onNotesChange,
}: PatientDetailsProps) {
  const isPhoneValid = /^09\d{9}$/.test(phone)

  const handlePhoneChange = (value: string) => {
    // Keep numbers only
    const digitsOnly = value.replace(/\D/g, '')

    // Limit to 11 digits
    const limitedPhone = digitsOnly.slice(0, 11)

    onPhoneChange(limitedPhone)
  }

  const hasName = fullName.trim().length > 0
  const hasValidPhone = isPhoneValid
  const hasEmail = email.trim().length > 0

  const completedFields = [
    hasName,
    hasValidPhone,
    hasEmail,
  ].filter(Boolean).length

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{
        staggerChildren: 0.08,
      }}
    >
      <Stack gap={32}>
        {/* =====================================================
            HERO
        ===================================================== */}

        <motion.div variants={fieldVariants}>
          <Stack gap="md">
            <Group gap="sm">
              <Badge
                color="smilehaos"
                variant="light"
                size="lg"
                radius="xl"
                leftSection={
                  <IconSparkles size={14} />
                }
              >
                Almost there · Your details
              </Badge>

              {completedFields === 3 && (
                <Badge
                  color="smilehaos"
                  variant="filled"
                  size="lg"
                  radius="xl"
                  leftSection={
                    <IconCheck size={14} />
                  }
                >
                  All set
                </Badge>
              )}
            </Group>

            <Title
              order={1}
              size="clamp(2.8rem, 7vw, 5.5rem)"
              style={{
                maxWidth: 950,
                lineHeight: 0.96,
                letterSpacing: '-0.055em',
              }}
            >
              Let's make it
              <br />

              <Text
                component="span"
                inherit
                c="smilehaos.6"
              >
                official.
              </Text>
            </Title>

            <Text
              size="xl"
              c="dimmed"
              maw={680}
              style={{
                lineHeight: 1.6,
              }}
            >
              Just a few details and your appointment
              will be ready to go.
            </Text>
          </Stack>
        </motion.div>

        {/* =====================================================
            PROGRESS / PERSONAL INFO INTRO
        ===================================================== */}

        <motion.div variants={fieldVariants}>
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
                '0 30px 90px rgba(0, 0, 0, 0.08)',
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 8, 0],
                scale: [1, 1.05, 1],
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
                right: -100,
                top: -110,
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
              <Flex
                justify="space-between"
                align="center"
                gap="md"
                wrap="wrap"
              >
                <Group
                  gap="md"
                  align="center"
                >
                  <ThemeIcon
                    size={58}
                    radius="xl"
                    variant="light"
                    color="smilehaos"
                  >
                    <IconUser size={30} />
                  </ThemeIcon>

                  <Stack gap={2}>
                    <Title
                      order={2}
                      size="clamp(1.5rem, 4vw, 2.2rem)"
                      style={{
                        letterSpacing:
                          '-0.035em',
                      }}
                    >
                      Tell us about you
                    </Title>

                    <Text
                      size="sm"
                      c="dimmed"
                    >
                      So the clinic knows who to expect.
                    </Text>
                  </Stack>
                </Group>

                <Badge
                  color={
                    completedFields === 3
                      ? 'smilehaos'
                      : 'gray'
                  }
                  variant={
                    completedFields === 3
                      ? 'filled'
                      : 'light'
                  }
                  size="lg"
                  radius="xl"
                >
                  {completedFields}/3 required
                </Badge>
              </Flex>

              <Divider />

              {/* =================================================
                  FULL NAME
              ================================================= */}

              <motion.div variants={fieldVariants}>
                <TextInput
                  label="Full name"
                  placeholder="Juan Dela Cruz"
                  value={fullName}
                  onChange={(event) =>
                    onFullNameChange(
                      event.currentTarget.value,
                    )
                  }
                  required
                  size="md"
                  radius="md"
                  leftSection={
                    <IconUser size={18} />
                  }
                  description="Enter your first and last name."
                />
              </motion.div>

              {/* =================================================
                  PHONE
              ================================================= */}

              <motion.div variants={fieldVariants}>
                <TextInput
                  label="Mobile number"
                  placeholder="09566326071"
                  description="Enter an 11-digit mobile number starting with 09."
                  value={phone}
                  onChange={(event) =>
                    handlePhoneChange(
                      event.currentTarget.value,
                    )
                  }
                  error={
                    phone.length > 0 &&
                    !isPhoneValid
                      ? 'Please enter a valid 11-digit mobile number starting with 09.'
                      : undefined
                  }
                  required
                  size="md"
                  radius="md"
                  maxLength={11}
                  inputMode="numeric"
                  leftSection={
                    <IconPhone size={18} />
                  }
                  rightSection={
                    isPhoneValid ? (
                      <IconCheck
                        size={18}
                        style={{
                          color:
                            'var(--mantine-color-smilehaos-6)',
                        }}
                      />
                    ) : undefined
                  }
                />
              </motion.div>

              {/* =================================================
                  EMAIL
              ================================================= */}

              <motion.div variants={fieldVariants}>
                <TextInput
                  label="Email address"
                  placeholder="juan@example.com"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    onEmailChange(
                      event.currentTarget.value,
                    )
                  }
                  required
                  size="md"
                  radius="md"
                  leftSection={
                    <IconMail size={18} />
                  }
                  description="We'll use this to send appointment information."
                />
              </motion.div>

              {/* =================================================
                  NOTES
              ================================================= */}

              <motion.div variants={fieldVariants}>
                <Textarea
                  label="Notes"
                  description="Optional"
                  placeholder="Anything the dentist should know before your visit?"
                  value={notes}
                  onChange={(event) =>
                    onNotesChange(
                      event.currentTarget.value,
                    )
                  }
                  minRows={5}
                  size="md"
                  radius="md"
                  leftSection={
                    <IconNotes size={18} />
                  }
                />
              </motion.div>
            </Stack>
          </Paper>
        </motion.div>

        {/* =====================================================
            PRIVACY / REASSURANCE CARD
        ===================================================== */}

        <motion.div variants={fieldVariants}>
          <Card
            radius="xl"
            padding="xl"
            withBorder
            style={{
              background:
                'var(--mantine-color-smilehaos-0)',
              borderColor:
                'var(--mantine-color-smilehaos-2)',
            }}
          >
            <Group
              align="flex-start"
              gap="md"
              wrap="nowrap"
            >
              <ThemeIcon
                size={48}
                radius="lg"
                variant="filled"
                color="smilehaos"
              >
                <IconCheck size={23} />
              </ThemeIcon>

              <Stack gap={4}>
                <Text
                  fw={800}
                  size="md"
                >
                  You're in good hands.
                </Text>

                <Text
                  size="sm"
                  c="dimmed"
                  lh={1.5}
                >
                  Your contact details help the clinic
                  confirm and manage your appointment.
                </Text>
              </Stack>
            </Group>
          </Card>
        </motion.div>
      </Stack>
    </motion.div>
  )
}

export default PatientDetails
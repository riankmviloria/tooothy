
import {
    Card,
    Stack,
    Text,
    Textarea,
    TextInput,
} from '@mantine/core'

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
    const isPhoneValid =
        /^09\d{9}$/.test(phone)

    const handlePhoneChange = (
        value: string,
    ) => {
        // Keep numbers only
        const digitsOnly = value.replace(
            /\D/g,
            '',
        )

        // Limit to 11 digits
        const limitedPhone =
            digitsOnly.slice(0, 11)

        onPhoneChange(limitedPhone)
    }

    

    return (
        <Card
            withBorder
            radius="xl"
            padding="xl"
        >
            <Stack gap="lg">
                <Stack gap={2}>
                    <Text
                        fw={700}
                        size="lg"
                    >
                        Your details
                    </Text>

                    <Text
                        size="sm"
                        c="dimmed"
                    >
                        We'll use these details to contact you
                        about your appointment.
                    </Text>
                </Stack>

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
                />

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
                    maxLength={11}
                    inputMode="numeric"
                />

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
                />

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
                    minRows={4}
                    size="md"
                />
            </Stack>
        </Card>
    )
}

export default PatientDetails
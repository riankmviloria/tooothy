import {
    Group,
    Stack,
    Text,
} from '@mantine/core'


type BrandProps = {
    showTagline?: boolean
    compact?: boolean
}

function Brand({
    showTagline = true,
    compact = false,
}: BrandProps) {
    return (
        <Group
            gap={compact ? 'xs' : 'sm'}
            align="center"
            wrap="nowrap"
        >
            <Text
                size={compact ? 'xl' : '2rem'}
                lh={1}
            >
                🦷
            </Text>

            <Stack gap={0}>
                <Text
                    fw={800}
                    size={compact ? 'lg' : 'xl'}
                    style={{
                        letterSpacing: '-0.04em',
                        lineHeight: 1,
                    }}
                >
                    SmileHaos
                </Text>

                {showTagline && !compact && (
                    <Text
                        size="xs"
                        c="dimmed"
                        mt={3}
                    >
                        Dental Care Made Simple
                    </Text>
                )}
            </Stack>
        </Group>
    )
}

export default Brand
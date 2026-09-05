export function generateAppointmentNumber(): string {
    const characters =
        'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

    let value = ''

    for (let index = 0; index < 6; index++) {
        const randomIndex =
            Math.floor(
                Math.random() *
                    characters.length,
            )

        value +=
            characters[randomIndex]
    }

    return `SHDC-${value}`
}
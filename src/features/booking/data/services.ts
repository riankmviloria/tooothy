import type { Service } from '../../services/types/service.types'

export const services: Service[] = [
    {
        id: '1',
        name: 'Dental Cleaning',
        duration: 45,
        price: 800,
        description:
            'Professional cleaning to keep your teeth and gums healthy.',
        icon: '🪥',
        isActive: true,
    },
    {
        id: '2',
        name: 'Tooth Filling',
        duration: 60,
        price: 1200,
        description:
            'Restore a damaged or decayed tooth.',
        icon: '✨',
        isActive: true,
    },
    {
        id: '3',
        name: 'Tooth Extraction',
        duration: 60,
        price: 1000,
        description:
            'Safe and professional tooth removal.',
        icon: '🦷',
        isActive: true,
    },
]
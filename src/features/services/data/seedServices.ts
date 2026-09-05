import {
    collection,
    addDoc,
} from 'firebase/firestore'

import { db } from '../../../lib/firebase'

const services = [
    {
        name: 'Braces',
        duration: 60,
        price: 7000,
        priceLabel: '₱7,000–₱10,000',
        description:
            'Down payment for upper and lower braces depends on the case after consultation. Monthly adjustment starts at ₱1,000 minimum.',
        icon: '😁',
        isActive: true,
    },
    {
        name: 'Tooth Restoration',
        duration: 30,
        price: 800,
        priceLabel: 'From ₱800',
        description:
            'Starts at ₱800 per surface. Final cost depends on the depth and condition of the tooth after cleaning.',
        icon: '✨',
        isActive: true,
    },
    {
        name: 'Tooth Extraction',
        duration: 30,
        price: 800,
        priceLabel: 'From ₱800',
        description:
            'Simple extraction starts at ₱800. Wisdom tooth removal starts at ₱4,000. Final cost depends on tooth position and examination.',
        icon: '🦷',
        isActive: true,
    },
    {
        name: 'Teeth Whitening',
        duration: 60,
        price: 8000,
        priceLabel: '₱8,000',
        description:
            'Two whitening cycles of 8 minutes each in one visit.',
        icon: '😁',
        isActive: true,
    },
    {
        name: 'Denture',
        duration: 30,
        price: 0,
        priceLabel: 'Consultation required',
        description:
            'Price depends on the number and position of missing teeth. Consultation is required for an accurate quotation.',
        icon: '🦷',
        isActive: true,
    },
    {
        name: 'Oral Prophylaxis',
        duration: 30,
        price: 800,
        priceLabel: 'From ₱800',
        description:
            'Professional dental cleaning. Final cost depends on the patient’s case.',
        icon: '🪥',
        isActive: true,
    },
    {
        name: 'Adjustment',
        duration: 30,
        price: 0,
        priceLabel: 'Price upon consultation',
        description:
            'Dental adjustment service. Pricing depends on the required treatment.',
        icon: '🔧',
        isActive: true,
    },
    {
        name: 'Consultation',
        duration: 30,
        price: 0,
        priceLabel: 'Free*',
        description:
            'Free consultation if the patient proceeds with any dental treatment.',
        icon: '👨‍⚕️',
        isActive: true,
    },
]

export const seedServices = async () => {
    const servicesCollection = collection(
        db,
        'services',
    )

    for (const service of services) {
        await addDoc(
            servicesCollection,
            service,
        )
    }

    console.log(
        `Seeded ${services.length} services.`,
    )
}
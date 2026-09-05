import type { Service } from '../../services/types/service.types'

export type TimeSlot = {
    time: string
    available: boolean
}

export type PatientDetails = {
    fullName: string
    phone: string
    email: string
    notes: string
}

export type Booking = {
    service: Service | null
    date: string | null
    time: string | null
    patient: PatientDetails
}
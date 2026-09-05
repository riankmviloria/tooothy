import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    type Unsubscribe,
} from 'firebase/firestore'

import { db } from '../../../lib/firebase'

import type { Service } from '../types/service.types'

const servicesCollection = collection(
    db,
    'services',
)

export const subscribeToServices = (
    onServices: (services: Service[]) => void,
    onError?: (error: Error) => void,
): Unsubscribe => {
    const servicesQuery = query(
        servicesCollection,
        orderBy('name'),
    )

    return onSnapshot(
        servicesQuery,
        (snapshot) => {
            const services =
                snapshot.docs.map(
                    (document) => ({
                        id: document.id,
                        ...document.data(),
                    } as Service),
                )

            onServices(services)
        },
        (error) => {
            console.error(
                'Failed to load services:',
                error,
            )

            onError?.(error)
        },
    )
}

/*
 * ADD SERVICE
 */
export const addService = async (
    service: Omit<Service, 'id'>,
): Promise<string> => {
    const document =
        await addDoc(
            servicesCollection,
            service,
        )

    return document.id
}

/*
 * UPDATE SERVICE
 */
export const updateService = async (
    serviceId: string,
    service: Partial<
        Omit<Service, 'id'>
    >,
): Promise<void> => {
    const serviceRef = doc(
        db,
        'services',
        serviceId,
    )

    await updateDoc(
        serviceRef,
        service,
    )
}

/*
 * DELETE SERVICE
 */
export const deleteService = async (
    serviceId: string,
): Promise<void> => {
    const serviceRef = doc(
        db,
        'services',
        serviceId,
    )

    await deleteDoc(
        serviceRef,
    )
}
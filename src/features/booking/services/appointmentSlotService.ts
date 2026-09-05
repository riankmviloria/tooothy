import {
    collection,
    getDocs,
    query,
    where,
} from 'firebase/firestore'

import { db } from '../../../lib/firebase'

export async function getBookedTimes(
    date: string,
): Promise<string[]> {
    const appointmentsQuery = query(
        collection(db, 'appointment_slots'),
        where('date', '==', date),
    )

    const snapshot = await getDocs(
        appointmentsQuery,
    )

    return snapshot.docs.map(
        (document) => document.data().time as string,
    )
}
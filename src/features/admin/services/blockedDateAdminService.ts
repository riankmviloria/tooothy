import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore'

import { db } from '../../../lib/firebase'

export type AdminBlockedDate = {
    id: string
    date: string
    reason: string
}

const blockedDatesCollection =
    collection(
        db,
        'blocked_dates',
    )

/*
 * REALTIME BLOCKED DATES
 */
export function subscribeToBlockedDates(
    onUpdate: (
        dates: AdminBlockedDate[],
    ) => void,
    onError: (
        error: Error,
    ) => void,
) {
    const blockedDatesQuery =
        query(
            blockedDatesCollection,
            orderBy(
                'date',
                'asc',
            ),
        )

    return onSnapshot(
        blockedDatesQuery,
        (snapshot) => {
            const dates =
                snapshot.docs.map(
                    (document) => {
                        const data =
                            document.data()

                        return {
                            id: document.id,
                            date:
                                data.date ??
                                document.id,
                            reason:
                                data.reason ??
                                '',
                        }
                    },
                )

            onUpdate(dates)
        },
        (error) => {
            console.error(
                'Blocked dates listener failed:',
                error,
            )

            onError(error)
        },
    )
}

/*
 * BLOCK DATE
 */
export async function blockDate(
    date: string,
    reason: string,
) {
    if (!date) {
        throw new Error(
            'Date is required.',
        )
    }

    const normalizedReason =
        reason.trim()

    if (!normalizedReason) {
        throw new Error(
            'Please provide a reason for blocking this date.',
        )
    }

    /*
     * Use the date itself as the document ID.
     *
     * Example:
     * blocked_dates/2026-09-15
     */
    const dateRef =
        doc(
            db,
            'blocked_dates',
            date,
        )

    await setDoc(
        dateRef,
        {
            date,
            reason: normalizedReason,
            createdAt:
                serverTimestamp(),
        },
    )
}

/*
 * UNBLOCK DATE
 */
export async function unblockDate(
    date: string,
) {
    if (!date) {
        throw new Error(
            'Date is required.',
        )
    }

    const dateRef =
        doc(
            db,
            'blocked_dates',
            date,
        )

    await deleteDoc(
        dateRef,
    )
}
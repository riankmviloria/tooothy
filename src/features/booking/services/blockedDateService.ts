import {
    collection,
    onSnapshot,
    orderBy,
    query,
} from 'firebase/firestore'

import { db } from '../../../lib/firebase'

export type BlockedDate = {
    id: string
    date: string
    reason: string
}

export function subscribeToBlockedDates(
    onUpdate: (
        blockedDates: BlockedDate[],
    ) => void,
    onError: (
        error: Error,
    ) => void,
) {
    const blockedDatesQuery =
        query(
            collection(
                db,
                'blocked_dates',
            ),
            orderBy(
                'date',
                'asc',
            ),
        )

    return onSnapshot(
        blockedDatesQuery,
        (snapshot) => {
            const blockedDates =
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

            onUpdate(
                blockedDates,
            )
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
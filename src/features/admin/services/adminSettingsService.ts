import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore'

import { db } from '../../../lib/firebase'

export type NotificationSettings = {
    adminEmail: string
    notifyAdminOnNewAppointment: boolean
    notifyAdminOnConfirmed: boolean
    notifyAdminOnCancelled: boolean
    notifyAdminOnCompleted: boolean
}

export const defaultNotificationSettings:
    NotificationSettings = {
        adminEmail: '',
        notifyAdminOnNewAppointment: true,
        notifyAdminOnConfirmed: false,
        notifyAdminOnCancelled: false,
        notifyAdminOnCompleted: false,
    }

const notificationSettingsRef = doc(
    db,
    'clinic_settings',
    'notifications',
)

export async function getNotificationSettings():
    Promise<NotificationSettings> {
    const snapshot =
        await getDoc(
            notificationSettingsRef,
        )

    if (!snapshot.exists()) {
        return defaultNotificationSettings
    }

    const data =
        snapshot.data()

    return {
        adminEmail:
            typeof data.adminEmail === 'string'
                ? data.adminEmail
                : '',

        notifyAdminOnNewAppointment:
            data.notifyAdminOnNewAppointment !== false,

        notifyAdminOnConfirmed:
            data.notifyAdminOnConfirmed === true,

        notifyAdminOnCancelled:
            data.notifyAdminOnCancelled === true,

        notifyAdminOnCompleted:
            data.notifyAdminOnCompleted === true,
    }
}

export async function saveNotificationSettings(
    settings: NotificationSettings,
): Promise<void> {
    await setDoc(
        notificationSettingsRef,
        {
            ...settings,
            updatedAt:
                serverTimestamp(),
        },
        {
            merge: true,
        },
    )
}
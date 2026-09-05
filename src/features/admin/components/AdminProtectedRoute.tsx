import {
    Center,
    Loader,
} from '@mantine/core'
import {
    onAuthStateChanged,
} from 'firebase/auth'
import {
    useEffect,
    useState,
    type ReactNode,
} from 'react'
import {
    Navigate,
} from 'react-router-dom'

import { auth } from '../../../lib/firebase'

type AdminProtectedRouteProps = {
    children: ReactNode
}

function AdminProtectedRoute({
    children,
}: AdminProtectedRouteProps) {
    const [user, setUser] =
        useState(auth.currentUser)

    const [loading, setLoading] =
        useState(true)

    useEffect(() => {
        const unsubscribe =
            onAuthStateChanged(
                auth,
                (currentUser) => {
                    setUser(currentUser)
                    setLoading(false)
                },
            )

        return unsubscribe
    }, [])

    if (loading) {
        return (
            <Center mih="100vh">
                <Loader color="smilehaos" />
            </Center>
        )
    }

    if (!user) {
        return (
            <Navigate
                to="/admin/login"
                replace
            />
        )
    }

    return <>{children}</>
}

export default AdminProtectedRoute
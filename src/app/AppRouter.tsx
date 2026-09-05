import {
    BrowserRouter,
    Route,
    Routes,
} from 'react-router-dom'

import HomePage from '../pages/HomePage'
import BookingPage from '../features/booking/pages/BookingPage'
import AdminLoginPage from '../pages/AdminLoginPage'

import AdminProtectedRoute from '../features/admin/components/AdminProtectedRoute'
import AdminLayout from '../features/admin/components/AdminLayout'

import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage'
import AdminAppointmentsPage from '../features/admin/pages/AdminAppointmentsPage'
import AdminSchedulePage from '../features/admin/pages/AdminSchedulePage'
import AdminSettingsPage from '../features/admin/pages/AdminSettingsPage'
import AdminServicesPage from '../features/admin/pages/AdminServicesPage'

import AppointmentStatusPage from '../features/booking/pages/AppointmentStatusPage'

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<HomePage />}
                />

                <Route
                    path="/book"
                    element={<BookingPage />}
                />

                <Route
                    path="/admin/login"
                    element={<AdminLoginPage />}
                />

                <Route
                    path="/appointment/:token"
                    element={
                        <AppointmentStatusPage />
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <AdminProtectedRoute>
                            <AdminLayout />
                        </AdminProtectedRoute>
                    }
                >
                    <Route
                        index
                        element={
                            <AdminDashboardPage />
                        }
                    />

                    <Route
                        path="appointments"
                        element={
                            <AdminAppointmentsPage />
                        }
                    />

                    <Route
                        path="schedule"
                        element={
                            <AdminSchedulePage />
                        }
                    />

                    <Route
                        path="services"
                        element={
                            <AdminServicesPage />
                        }
                    />

                    <Route
                        path="settings"
                        element={
                            <AdminSettingsPage />
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter
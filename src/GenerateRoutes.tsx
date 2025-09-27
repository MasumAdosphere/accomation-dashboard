import Users from './pages/dashboard/Users'
import DashboardPages from './pages/dashboard'
import Article from './pages/dashboard/Article'
import { AppCheck } from './middleware/middleware'
import DashboardLayout from './layouts/dashboard.layout'
import { Navigate, RouteObject } from 'react-router-dom'
import Testimonial from './pages/dashboard/testimonail'
import Faq from './pages/dashboard/faq'
import Logo from './pages/dashboard/Logo'
import Career from './pages/dashboard/career'

const { Categories, Overview } = DashboardPages

const generateRoutes = (): RouteObject[] => {
    return [
        {
            path: '/dashboard',
            element: (
                <AppCheck>
                    <DashboardLayout />
                </AppCheck>
            ),
            children: [
                {
                    path: '',
                    element: (
                        // <ProtectedRoute allowedRoles={allowedRoles.overview}>
                        <Navigate
                            to={`${
                                window.location.pathname === '/' ||
                                window.location.pathname === '/dashboard/' ||
                                window.location.pathname === '/dashboard'
                                    ? 'overview'
                                    : window.location.pathname
                            }`}
                            replace
                        />
                        // </ProtectedRoute>
                    )
                },
                {
                    path: 'overview',
                    element: (
                        // <ProtectedRoute allowedRoles={allowedRoles.overview}>
                        <Overview />
                        // </ProtectedRoute>
                    )
                },
                {
                    path: 'articles',
                    element: (
                        // <ProtectedRoute allowedRoles={allowedRoles.article}>
                        <Article />
                        // </ProtectedRoute>
                    )
                },
                {
                    path: 'testimonials',
                    element: (
                        // <ProtectedRoute allowedRoles={allowedRoles.article}>
                        <Testimonial />
                        // </ProtectedRoute>
                    )
                },
                {
                    path: 'faq',
                    element: (
                        // <ProtectedRoute allowedRoles={allowedRoles.article}>
                        <Faq />
                        // </ProtectedRoute>
                    )
                },
                {
                    path: 'logos',
                    element: (
                        // <ProtectedRoute allowedRoles={allowedRoles.article}>
                        <Logo />
                        // </ProtectedRoute>
                    )
                },

                {
                    path: 'categories',
                    element: (
                        // <ProtectedRoute allowedRoles={allowedRoles.categories}>
                        <Categories />
                        // </ProtectedRoute>
                    )
                },
                {
                    path: 'career',
                    element: (
                        // <ProtectedRoute allowedRoles={allowedRoles.categories}>
                        <Career />
                        // </ProtectedRoute>
                    )
                },
                {
                    path: 'users',
                    element: (
                        // <ProtectedRoute allowedRoles={allowedRoles.categories}>
                        <Users />
                        // </ProtectedRoute>
                    )
                }
            ]
        }
    ]
}

export default generateRoutes

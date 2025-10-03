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
import ProtectedRoute from './ProtectedRoutes'

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
                        <ProtectedRoute allowedPermissions={['Logo:read', 'Logo:read', 'Logo:update', 'Logo:delete']}>
                            <Overview />
                        </ProtectedRoute>
                    )
                },
                {
                    path: 'articles',
                    element: (
                        <ProtectedRoute allowedPermissions={['Blog:create', 'Blog:read', 'Blog:update', 'Blog:delete']}>
                            <Article />
                        </ProtectedRoute>

                        // <ProtectedRoute allowedRoles={allowedRoles.article}>
                        // </ProtectedRoute>
                    )
                },
                {
                    path: 'testimonials',
                    element: (
                        <ProtectedRoute allowedPermissions={['Testimonial:create', 'Testimonial:read', 'Testimonial:update', 'Testimonial:delete']}>
                            <Testimonial />
                        </ProtectedRoute>
                        // <ProtectedRoute allowedRoles={allowedRoles.article}>
                        // </ProtectedRoute>
                    )
                },
                {
                    path: 'faq',
                    element: (
                        <ProtectedRoute allowedPermissions={['Faq:create', 'Faq:read', 'Faq:update', 'Faq:delete']}>
                            <Faq />
                        </ProtectedRoute>
                        // <ProtectedRoute allowedRoles={allowedRoles.article}>
                        // </ProtectedRoute>
                    )
                },
                {
                    path: 'logos',
                    element: (
                        <ProtectedRoute allowedPermissions={['Logo:create', 'Logo:read', 'Logo:update', 'Logo:delete']}>
                            <Logo />
                        </ProtectedRoute>
                        // <ProtectedRoute allowedRoles={allowedRoles.article}>
                        // </ProtectedRoute>
                    )
                },

                {
                    path: 'categories',
                    element: (
                        <ProtectedRoute allowedPermissions={['Category:create', 'Category:read', 'Category:update', 'Category:delete']}>
                            <Categories />
                        </ProtectedRoute>
                        // <ProtectedRoute allowedRoles={allowedRoles.categories}>
                        // </ProtectedRoute>
                    )
                },
                {
                    path: 'career',
                    element: (
                        <ProtectedRoute allowedPermissions={['Career:create', 'Career:read', 'Career:update', 'Career:delete']}>
                            <Career />
                        </ProtectedRoute>
                        // <ProtectedRoute allowedRoles={allowedRoles.categories}>
                        // </ProtectedRoute>
                    )
                },
                {
                    path: 'users',
                    element: (
                        <ProtectedRoute allowedPermissions={['Admin:create', 'Admin:read', 'Admin:update', 'Admin:delete']}>
                            <Users />
                        </ProtectedRoute>
                        // <ProtectedRoute allowedRoles={allowedRoles.categories}>
                        // </ProtectedRoute>
                    )
                }
            ]
        }
    ]
}

export default generateRoutes

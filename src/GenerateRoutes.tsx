import Users from './pages/dashboard/Users'
import DashboardPages from './pages/dashboard'
import Article from './pages/dashboard/Article'
import { AppCheck } from './middleware/middleware'
import EditArticle from './pages/dashboard/EditArticle'
import DashboardLayout from './layouts/dashboard.layout'
import { Navigate, RouteObject } from 'react-router-dom'
import CreateArticle from './pages/dashboard/CreateArticle'
import Testimonial from './pages/dashboard/testimonail'
import CreateTestimonials from './pages/dashboard/CreateTestimonial'
import EditTestimonials from './pages/dashboard/EditTestimonial'
import CreateFaq from './pages/dashboard/CreateFaq'
import EditFaq from './pages/dashboard/EditFaq'
import Faq from './pages/dashboard/faq'
import Logo from './pages/dashboard/Logo'
import CreateLogo from './pages/dashboard/CreateLogo'

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
                    path: 'logos/add',
                    element: (
                        // <ProtectedRoute allowedRoles={allowedRoles.article}>
                        <CreateLogo />
                        // </ProtectedRoute>
                    )
                },
                {
                    path: 'articles/add',
                    element: (
                        // <ProtectedRoute allowedRoles={allowedRoles.article}>
                        <CreateArticle />
                        // </ProtectedRoute>
                    )
                },
                {
                    path: 'testimonials/add',
                    element: (
                        // <ProtectedRoute allowedRoles={allowedRoles.article}>
                        <CreateTestimonials />
                        // </ProtectedRoute>
                    )
                },
                {
                    path: 'faq/add',
                    element: (
                        // <ProtectedRoute allowedRoles={allowedRoles.article}>
                        <CreateFaq />
                        // </ProtectedRoute>
                    )
                },
                {
                    path: 'articles/edit/:articleSlug',
                    element: (
                        // <ProtectedRoute allowedRoles={allowedRoles.article}>
                        <EditArticle />
                        // </ProtectedRoute>
                    )
                },
                {
                    path: 'testimonials/edit/:testimonialId',
                    element: (
                        // <ProtectedRoute allowedRoles={allowedRoles.article}>
                        <EditTestimonials />
                        // </ProtectedRoute>
                    )
                },

                {
                    path: 'faq/edit/:faqId',
                    element: (
                        // <ProtectedRoute allowedRoles={allowedRoles.article}>
                        <EditFaq />
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

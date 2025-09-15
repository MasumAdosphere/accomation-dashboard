import AuthPages from './pages/auth'
import Layouts from './layouts/index'
import { createBrowserRouter } from 'react-router-dom'
import PageNotFound from './components/pageNotFound'
import { AuthCheck } from './middleware/middleware'
import generateRoutes from './GenerateRoutes'

const { AuthLayout, RootLayout } = Layouts
const { Login } = AuthPages

// eslint-disable-next-line react-refresh/only-export-components
export default createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: (
                    <AuthCheck>
                        <AuthLayout />
                    </AuthCheck>
                ),
                children: [
                    {
                        path: '',
                        element: <Login />
                    }
                ]
            },
            ...generateRoutes()
        ]
    },
    {
        path: '*',
        element: <PageNotFound />
    }
])

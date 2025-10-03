import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from './types/selector.types'

interface ProtectedRouteProps {
    children: React.ReactNode
    allowedPermissions: string[] // 👈 replace roles with permissions
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedPermissions }) => {
    const { user } = useSelector((state: RootState) => state.User) // Assuming user data is stored in Redux
    const location = useLocation()

    // ✅ check if user exists
    if (!user) {
        return (
            <Navigate
                to="/auth"
                state={{ from: location }}
                replace
            />
        )
    }

    // ✅ check if user has required permission(s)
    const userPermissions = user?.permissions || []
    const hasPermission = allowedPermissions.some((perm) => userPermissions.includes(perm))

    if (!hasPermission) {
        return (
            <Navigate
                to="/dashboard/overview"
                state={{ from: location }}
                replace
            />
        )
    }

    return <>{children}</>
}

export default ProtectedRoute

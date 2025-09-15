import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from './types/selector.types'

interface ProtectedRouteProps {
    children: React.ReactNode
    allowedRoles: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user } = useSelector((state: RootState) => state.User) // Assuming user data is stored in Redux
    const location = useLocation()
    if (!user) {
        return (
            <Navigate
                to="/auth"
                state={{ from: location }}
                replace
            />
        )
    }

    return <>{children}</>
}

export default ProtectedRoute

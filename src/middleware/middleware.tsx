import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile } from '../redux/user/user.thunk'
import LoadingComponent from '../components/custom/loadingComponent'

export const AuthCheck = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const letsDoIt = async () => {
            const data = await getProfile()

            if (data) {
                return navigate('/dashboard/overview')
            } else {
                setLoading(false)
                return null
            }
        }

        letsDoIt()
    }, [])

    if (loading) {
        return <LoadingComponent />
    }

    return children
}

export const AppCheck = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const letsDoIt = async () => {
            const data = await getProfile()
            if (data) {
                setLoading(false)
                return null
            } else {
                return navigate('/')
            }
        }

        letsDoIt()
    }, [])

    if (loading) {
        return <LoadingComponent />
    }

    return children
}

import { useEffect } from 'react'
import { message as Mes } from 'antd'
import { Outlet } from 'react-router-dom'
import { RootState } from '../types/selector.types'
import { ErrorBoundary } from 'react-error-boundary'
import { useDispatch, useSelector } from 'react-redux'
import ApiErrorPage from '../components/custom/apiError'
import { clearError, clearMessage } from '../redux/common/common.slice'

const handleError = (error: Error) => {
    Mes.error(error.message || 'An unexpected error occurred')
}

const RootLayout = () => {
    const dispatch = useDispatch()
    const [messageApi, contextHolder] = Mes.useMessage()

    const { error, isRefreshTokenError, message } = useSelector((state: RootState) => state.Common)

    useEffect(() => {
        // for error message toast
        if (error) {
            if (!isRefreshTokenError) {
                messageApi.open({
                    type: 'error',
                    content: error
                })
                dispatch(clearError())
            }
        }

        // for success message toast
        if (message) {
            messageApi.open({
                type: 'success',
                content: message
            })
            dispatch(clearMessage())
        }
    }, [dispatch, error, message])

    return (
        <>
            {contextHolder}
            <ErrorBoundary
                fallback={<ApiErrorPage />}
                onError={handleError}>
                <Outlet />
            </ErrorBoundary>
        </>
    )
}

export default RootLayout

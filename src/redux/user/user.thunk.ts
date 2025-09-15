import Api from '../httpAPI'
import { store } from '../store'
import execError from '../execError'
import { userSuccess } from './user.slice'
import { responseSuccess } from '../common/common.slice'

export const getProfile = async () => {
    try {
        const res = await Api.User.getProfile()
        const { message, data } = res
        store.dispatch(responseSuccess(message))
        store.dispatch(userSuccess({ user: data }))
        return data
    } catch (error) {
        return execError(error)
    }
}

// Fetch Users
export const fetchUsers = async (signal: AbortSignal, page: number, pageSize: number) => {
    try {
        const response = await Api.User.fetchUsers(signal, page, pageSize)
        return response
    } catch (error) {
        return execError(error)
    }
}

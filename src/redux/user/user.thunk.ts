import Api from '../httpAPI'
import { store } from '../store'
import execError from '../execError'
import { userSuccess } from './user.slice'
import { responseSuccess } from '../common/common.slice'
import { ICreateUser } from '../../types/state.types'

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
export const createUsers = async (payload: ICreateUser) => {
    try {
        const response = await Api.User.createUser(payload)
        return response
    } catch (error) {
        return execError(error)
    }
}

export const deleteUser = async (id: string) => {
    try {
        const data = await Api.User.deleteUser(id)
        const { message } = data
        store.dispatch(responseSuccess({ message }))
        return data
    } catch (error) {
        return execError(error)
    }
}

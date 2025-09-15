import Api from '../httpAPI.js'
import { store } from '../store.js'
import execError from '../execError.js'
import { responseRequest, responseSuccess, setAccessToken } from '../common/common.slice.js'

export const login = async (reqBody: { email: string; password: string }) => {
    try {
        store.dispatch(responseRequest())
        const data = await Api.Auth.login(reqBody)
        const { message } = data
        store.dispatch(responseSuccess({ message }))
        store.dispatch(setAccessToken(data?.data?.accessToken || null))

        return data
    } catch (error) {
        return execError(error)
    }
}

export const logout = async () => {
    try {
        store.dispatch(responseRequest())
        const data = await Api.Auth.logout()
        const { message } = data
        store.dispatch(responseSuccess({ message }))
        return data
    } catch (error) {
        return execError(error)
    }
}

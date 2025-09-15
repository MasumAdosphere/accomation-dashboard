import { store } from './store'
import { responseFail } from './common/common.slice'

export default (err: unknown) => {
    // @ts-ignore
    if (err.code !== 'ERR_CANCELED' && err.status !== 401) {
        // @ts-ignore
        const message = err?.response?.data?.message || err?.message || 'An unexpected error occurred'
        store.dispatch(responseFail({ message }))
    }

    return null
}

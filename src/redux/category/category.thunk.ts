import Api from '../httpAPI'
import { store } from '../store'
import execError from '../execError'
import { responseSuccess } from '../common/common.slice'

export const createCategory = async (payload: { title: string; feature: string }) => {
    try {
        const res = await Api.Category.createCategory(payload)
        const { message } = res
        store.dispatch(responseSuccess({ message }))

        return res
    } catch (error) {
        return execError(error)
    }
}

export const getAllCategories = async (pageSize: number, page: number, feature: string, signal: AbortSignal) => {
    try {
        const data = await Api.Category.getAllCategories(pageSize, page, feature, signal)
        return data
    } catch (error) {
        return execError(error)
    }
}
export const deleteCategoryById = async (categoryId: string) => {
    try {
        const data = await Api.Category.deleteCategory(categoryId)
        const { message } = data
        store.dispatch(responseSuccess({ message }))
        return data
    } catch (error) {
        return execError(error)
    }
}

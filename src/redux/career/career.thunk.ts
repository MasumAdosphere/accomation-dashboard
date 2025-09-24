import Api from '../httpAPI'
import { store } from '../store'
import execError from '../execError'
import { responseRequest, responseSuccess } from '../common/common.slice'
import { ICareer, ICareerCreate, IfaqPayload } from '../../types/state.types'

export const getAllCareers = async (pageName: string, signal: AbortSignal) => {
    try {
        const res = await Api.Career.getAllCareers(pageName, signal)
        return res
    } catch (error) {
        return execError(error)
    }
}

export const createCareer = async (payload: ICareerCreate) => {
    try {
        store.dispatch(responseRequest())
        const { data, message } = await Api.Career.createCareer(payload)
        store.dispatch(responseSuccess({ message }))
        return data
    } catch (error) {
        return execError(error)
    }
}

export const publishActionById = async (slug: string, isPublished: boolean, signal: AbortSignal) => {
    try {
        store.dispatch(responseRequest())
        const data = await Api.Article.publishAction(slug, { isPublished }, signal)
        const { message } = data
        store.dispatch(responseSuccess({ message }))
        return data
    } catch (error) {
        return execError(error)
    }
}

export const getCareerById = async (faqId: string) => {
    try {
        const { data } = await Api.Career.getCareerById(faqId)
        return data
    } catch (error) {
        return execError(error)
    }
}
export const editCareer = async (faqId: string, payload: any) => {
    try {
        store.dispatch(responseRequest())
        const { data, message } = await Api.Career.editCareerById(faqId, payload)
        store.dispatch(responseSuccess({ message }))
        return data
    } catch (error) {
        return execError(error)
    }
}

export const uploadFileUrl = async (formData: FormData) => {
    try {
        const data = await Api.Article.uploadFile(formData)
        store.dispatch(responseSuccess({ message: data.message }))
        return data
    } catch (error) {
        return execError(error)
    }
}

export const uploadToS3 = async (file: File, url: string, onProgress?: (progress: number) => void) => {
    try {
        const data = await Api.Article.uploadToS3(file, url, onProgress)
        return data
    } catch (error) {
        return execError(error)
    }
}

export const deleteCareer = async (faqId: string) => {
    try {
        const data = await Api.Career.deleteCareer(faqId)
        const { message } = data
        store.dispatch(responseSuccess({ message }))
        return data
    } catch (error) {
        return execError(error)
    }
}

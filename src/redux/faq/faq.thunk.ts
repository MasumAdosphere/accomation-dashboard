import Api from '../httpAPI'
import { store } from '../store'
import execError from '../execError'
import { responseRequest, responseSuccess } from '../common/common.slice'
import { IFaq, IfaqPayload } from '../../types/state.types'

export const getAllFaqs = async (pageSize: number, page: number, pageName: string, signal: AbortSignal) => {
    try {
        const res = await Api.Faq.getAllFaq(pageSize, page, pageName, signal)
        // const { data } = res
        return res
    } catch (error) {
        return execError(error)
    }
}

export const createFaq = async (payload: IfaqPayload) => {
    try {
        store.dispatch(responseRequest())
        const { data, message } = await Api.Faq.createFaqs(payload)
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

export const getFaqById = async (faqId: string) => {
    try {
        const { data } = await Api.Faq.getFaqById(faqId)
        return data
    } catch (error) {
        return execError(error)
    }
}
export const editFaq = async (faqId: string, payload: any) => {
    try {
        store.dispatch(responseRequest())
        const { data, message } = await Api.Faq.editFaqById(faqId, payload)
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

export const deleteFaqById = async (faqId: string) => {
    try {
        const data = await Api.Faq.deleteFaq(faqId)
        const { message } = data
        store.dispatch(responseSuccess({ message }))
        return data
    } catch (error) {
        return execError(error)
    }
}

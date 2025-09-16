import Api from '../httpAPI'
import { store } from '../store'
import execError from '../execError'
import { responseRequest, responseSuccess } from '../common/common.slice'

export const getAllTestimonials = async (pageSize: number, page: number, signal: AbortSignal) => {
    try {
        const res = await Api.Testimonial.getAllTestimonials(pageSize, page, signal)
        // const { data } = res
        return res
    } catch (error) {
        return execError(error)
    }
}

export const createTestimonials = async (payload: FormData) => {
    try {
        store.dispatch(responseRequest())
        const { data, message } = await Api.Testimonial.createTestimonials(payload)
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

export const getTestimonialById = async (testimonialId: string) => {
    try {
        const { data } = await Api.Testimonial.getTestimonialById(testimonialId)
        return data
    } catch (error) {
        return execError(error)
    }
}
export const editTestimonials = async (testimonialId: string, payload: any) => {
    try {
        store.dispatch(responseRequest())
        const { data, message } = await Api.Testimonial.editTestimonialById(testimonialId, payload)
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

export const deleteTestimonialById = async (testimonialId: string) => {
    try {
        const data = await Api.Testimonial.deleteTestimonial(testimonialId)
        const { message } = data
        store.dispatch(responseSuccess({ message }))
        return data
    } catch (error) {
        return execError(error)
    }
}

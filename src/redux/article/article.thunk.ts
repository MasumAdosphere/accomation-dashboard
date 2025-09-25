import Api from '../httpAPI'
import { store } from '../store'
import execError from '../execError'
import { responseRequest, responseSuccess } from '../common/common.slice'

export const getAllArticles = async (pageSize: number, page: number, signal: AbortSignal) => {
    try {
        const res = await Api.Article.getAllArticles(pageSize, page, signal)
        // const { data } = res
        return res
    } catch (error) {
        return execError(error)
    }
}

export const createArticle = async (payload: FormData) => {
    try {
        store.dispatch(responseRequest())
        const { data, message } = await Api.Article.createArticle(payload)
        store.dispatch(responseSuccess({ message }))
        return data
    } catch (error) {
        return execError(error)
    }
}

export const publishActionById = async (id: string, isFeatured: boolean, signal: AbortSignal) => {
    try {
        store.dispatch(responseRequest())
        const data = await Api.Article.publishAction(id, { isFeatured }, signal)
        const { message } = data
        store.dispatch(responseSuccess({ message }))
        return data
    } catch (error) {
        return execError(error)
    }
}

export const getArticleById = async (articleId: string) => {
    try {
        const { data } = await Api.Article.getArticleById(articleId)
        return data
    } catch (error) {
        return execError(error)
    }
}
export const editArticle = async (articleId: string, payload: any) => {
    try {
        store.dispatch(responseRequest())
        const { data, message } = await Api.Article.editArticleBySlug(articleId, payload)
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

export const deleteArticleById = async (articleId: string) => {
    try {
        const data = await Api.Article.deleteArticle(articleId)
        const { message } = data
        store.dispatch(responseSuccess({ message }))
        return data
    } catch (error) {
        return execError(error)
    }
}

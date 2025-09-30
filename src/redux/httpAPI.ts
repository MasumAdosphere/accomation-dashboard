import axios from 'axios'
import { store } from './store'
import configs from '../configs'
import { resetState } from './resetSlice'
import { refreshTokenFail, refreshTokenSuccess } from './common/common.slice'
import { ICareerCreate, ICreateUser, IfaqPayload } from '../types/state.types'

const { server } = configs
const { SERVER_URL } = server

// Create an instance of Axios
const apiInstance = axios.create({
    baseURL: SERVER_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
})
const formDataApiInstance = axios.create({
    baseURL: SERVER_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
    }
})

const refreshToken = async (payload = {}) => {
    try {
        const res = await axios.put(`${SERVER_URL}/admin/refreshToken`, payload, {
            withCredentials: true
        })
        return res
    } catch (error) {
        //@ts-ignore
        if (error.response?.status === 401) {
            store.dispatch(refreshTokenFail())
        }
        throw error
    }
}

let isRefreshing = false
let failedQueue: {
    resolve: (value: unknown) => void
    reject: (reason?: any) => void
}[] = []

const processQueue = (error: unknown, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        const errorStatusCode = error?.response?.status
        if (error.code === 'ERR_NETWORK') {
            // store.dispatch(APIErrorOn());
        } else if (errorStatusCode === 401 && !originalRequest._isRetry) {
            if (!isRefreshing) {
                isRefreshing = true
                try {
                    originalRequest._isRetry = true
                    const headers = { ...originalRequest.headers }
                    const { data } = await refreshToken()

                    apiInstance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
                    processQueue(null, data.accessToken)
                    return apiInstance.request({ ...originalRequest, headers })
                } catch (err) {
                    processQueue(err, null)
                    store.dispatch(refreshTokenFail())
                    return Promise.reject(err)
                } finally {
                    isRefreshing = false
                }
            } else {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`
                        return apiInstance(originalRequest)
                    })
                    .catch((err) => {
                        return Promise.reject(err)
                    })
            }
        } else if (errorStatusCode === 429) {
            store.dispatch(resetState())
        }

        store.dispatch(refreshTokenSuccess())
        return Promise.reject(error)
    }
)

// Exporting Api
export default {
    Auth: {
        login: async (payload = {}) => {
            const { data } = await apiInstance.put('/admin/login', payload)
            return data
        },

        logout: async () => {
            const { data } = await apiInstance.put('/admin/logout', {})
            return data
        }
    },
    Insights: {
        getInsights: async (signal: AbortSignal) => {
            const { data } = await apiInstance.get(`/admin/dashboard`, {
                signal
            })
            return data
        }
    },
    User: {
        getProfile: async () => {
            const { data } = await apiInstance.get('/admin/self')
            return data
        },
        fetchUsers: async (signal: AbortSignal, page: number, pageSize: number) => {
            const queryParams = {
                page,
                pageSize
            }
            const { data } = await apiInstance.get(`/admin/user`, {
                params: queryParams,
                signal
            })
            return data
        },
        createUser: async (payload: ICreateUser) => {
            const { data } = await apiInstance.post('/admin/user', payload)
            return data
        },
        deleteUser: async (id: string) => {
            const { data } = await apiInstance.delete(`/admin/user/${id}`)
            return data
        }
    },
    Category: {
        createCategory: async (payload = {}) => {
            const { data } = await apiInstance.post('/admin/category', payload)
            return data
        },
        getCategoryById: async (categoryId: string) => {
            const { data } = await apiInstance.get(`/admin/category/${categoryId}`)
            return data
        },
        editArticleById: async (categoryId: string, payload = {}) => {
            const { data } = await apiInstance.put(`/admin/category/${categoryId}`, payload)
            return data
        },

        getAllCategories: async (pageSize: number, page: number, feature: string, signal: AbortSignal) => {
            const queryParams = {
                pageSize,
                page,
                feature
            }
            const { data } = await apiInstance.get('/admin/category', {
                params: queryParams,
                signal
            })

            return data
        },
        deleteCategory: async (categoryId: string) => {
            const { data } = await apiInstance.delete(`/admin/category/${categoryId}`)
            return data
        }
    },

    Article: {
        createArticle: async (formData: FormData) => {
            const { data } = await formDataApiInstance.post('/admin/blog', formData)
            return data
        },
        getArticleById: async (articleId: string) => {
            const { data } = await apiInstance.get(`/admin/blog/${articleId}`)
            return data
        },
        editArticleBySlug: async (articleId: string, payload = {}) => {
            const { data } = await formDataApiInstance.put(`/admin/blog/${articleId}`, payload)
            return data
        },
        publishAction: async (id: string, payload: { isFeatured: boolean }, signal: AbortSignal) => {
            const { data } = await apiInstance.put(`/admin/blog/${id}/mark-featured`, payload, { signal })
            return data
        },
        uploadFile: async (payload: FormData) => {
            const { data } = await apiInstance.post('/admin/upload', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return data
        },
        uploadToS3: async (file: File, url: string, onProgress?: (progress: number) => void) => {
            const response = await axios.put(url, file, {
                headers: {
                    'Content-Type': file.type
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        if (onProgress) onProgress(percent)
                    }
                }
            })

            return response
        },

        getAllArticles: async (pageSize: number, page: number, signal: AbortSignal, category?: string, title?: String) => {
            const queryParams = {
                pageSize,
                page,
                category,
                title
            }
            const { data } = await apiInstance.get('/admin/blog', {
                params: queryParams,
                signal
            })

            return data
        },
        deleteArticle: async (articleId: string) => {
            const { data } = await apiInstance.delete(`/admin/blog/${articleId}`)
            return data
        }
    },
    Logo: {
        createLogo: async (formData: FormData) => {
            const { data } = await formDataApiInstance.post('/admin/logo', formData)
            return data
        },
        getLogoById: async (logoId: string) => {
            const { data } = await apiInstance.get(`/admin/logo/${logoId}`)
            return data
        },
        publishAction: async (id: string, payload: { isLive: boolean }, signal: AbortSignal) => {
            const { data } = await apiInstance.put(`/admin/logo/${id}/mark-featured`, payload, { signal })
            return data
        },
        uploadFile: async (payload: FormData) => {
            const { data } = await apiInstance.post('/admin/upload', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return data
        },
        uploadToS3: async (file: File, url: string, onProgress?: (progress: number) => void) => {
            const response = await axios.put(url, file, {
                headers: {
                    'Content-Type': file.type
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        if (onProgress) onProgress(percent)
                    }
                }
            })

            return response
        },

        getAllLogo: async (pageSize: number, page: number, signal: AbortSignal) => {
            const queryParams = {
                pageSize,
                page
            }
            const res = await apiInstance.get('/admin/logo', {
                params: queryParams,
                signal
            })
            return res
        },
        deleteLogo: async (logoId: string) => {
            const { data } = await apiInstance.delete(`/admin/logo/${logoId}`)
            return data
        }
    },

    Testimonial: {
        createTestimonials: async (formData: FormData) => {
            const { data } = await formDataApiInstance.post('/admin/testimonial', formData)
            return data
        },
        getTestimonialById: async (testimonialId: string) => {
            const { data } = await apiInstance.get(`/admin/testimonial/${testimonialId}`)
            return data
        },
        editTestimonialById: async (testimonialId: string, payload = {}) => {
            const { data } = await formDataApiInstance.put(`/admin/testimonial/${testimonialId}`, payload)
            return data
        },
        publishAction: async (id: string, payload: { isFeatured: boolean }, signal: AbortSignal) => {
            const { data } = await apiInstance.put(`/admin/testimonial/${id}/mark-featured`, payload, { signal })
            return data
        },
        uploadFile: async (payload: FormData) => {
            const { data } = await apiInstance.post('/admin/upload', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return data
        },
        uploadToS3: async (file: File, url: string, onProgress?: (progress: number) => void) => {
            const response = await axios.put(url, file, {
                headers: {
                    'Content-Type': file.type
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        if (onProgress) onProgress(percent)
                    }
                }
            })

            return response
        },

        getAllTestimonials: async (pageSize: number, page: number, signal: AbortSignal) => {
            const queryParams = {
                pageSize,
                page
            }
            const { data } = await apiInstance.get('/admin/testimonial', {
                params: queryParams,
                signal
            })

            return data
        },
        deleteTestimonial: async (testimonialId: string) => {
            const { data } = await apiInstance.delete(`/admin/testimonial/${testimonialId}`)
            return data
        }
    },
    Faq: {
        createFaqs: async (payload: IfaqPayload) => {
            // 👈 Changed from FormData to IFaq
            const { data } = await apiInstance.post('/admin/faq', payload)
            return data
        },
        getFaqById: async (FaqId: string) => {
            const { data } = await apiInstance.get(`/admin/faq/${FaqId}`)
            return data
        },
        editFaqById: async (FaqId: string, payload = {}) => {
            const { data } = await apiInstance.put(`/admin/faq/${FaqId}`, payload)
            return data
        },
        publishAction: async (id: string, payload: { isFeatured: boolean }, signal: AbortSignal) => {
            const { data } = await apiInstance.put(`/admin/faq/${id}/mark-featured`, payload, { signal })
            return data
        },
        uploadFile: async (payload: FormData) => {
            const { data } = await apiInstance.post('/admin/upload', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return data
        },
        uploadToS3: async (file: File, url: string, onProgress?: (progress: number) => void) => {
            const response = await axios.put(url, file, {
                headers: {
                    'Content-Type': file.type
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        if (onProgress) onProgress(percent)
                    }
                }
            })

            return response
        },

        getAllFaq: async (pageName: String, signal: AbortSignal) => {
            const queryParams = {
                pageName
            }
            const { data } = await apiInstance.get('/admin/faq', {
                params: queryParams,
                signal
            })

            return data
        },
        deleteFaq: async (FaqId: string) => {
            const { data } = await apiInstance.delete(`/admin/faq/${FaqId}`)
            return data
        },
        updateFaqSequences: async (faqs: { id: string; sequenceId: number }[]) => {
            const { data } = await apiInstance.put(`/admin/faq/sequence`, faqs)
            return data
        }
    },
    Career: {
        createCareer: async (payload: ICareerCreate) => {
            const { data } = await apiInstance.post('/admin/career', payload)
            return data
        },
        getCareerById: async (CareerId: string) => {
            const { data } = await apiInstance.get(`/admin/career/${CareerId}`)
            return data
        },
        editCareerById: async (CareerId: string, payload = {}) => {
            const { data } = await apiInstance.put(`/admin/career/${CareerId}`, payload)
            return data
        },
        publishAction: async (id: string, payload: { isLive: boolean }, signal: AbortSignal) => {
            const { data } = await apiInstance.put(`/admin/career/${id}/mark-featured`, payload, { signal })
            return data
        },
        uploadFile: async (payload: FormData) => {
            const { data } = await apiInstance.post('/admin/upload', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return data
        },
        uploadToS3: async (file: File, url: string, onProgress?: (progress: number) => void) => {
            const response = await axios.put(url, file, {
                headers: {
                    'Content-Type': file.type
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        if (onProgress) onProgress(percent)
                    }
                }
            })

            return response
        },

        getAllCareers: async (pageName: String, signal: AbortSignal) => {
            const queryParams = {
                pageName
            }
            const { data } = await apiInstance.get('/admin/career', {
                params: queryParams,
                signal
            })

            return data
        },
        deleteCareer: async (CareerId: string) => {
            const { data } = await apiInstance.delete(`/admin/career/${CareerId}`)
            return data
        }
    },
    Gallery: {
        fetchGallery: async (pageSize = 10, page = 1, fileName: string | null, mediaType: string, signal: AbortSignal) => {
            const queryParams = {
                pageSize,
                page,
                fileName,
                mediaType
            }
            const { data } = await apiInstance.get(`/admin/gallery`, {
                params: queryParams,
                signal
            })

            return data
        },
        fileUpload: async (payload = {}) => {
            const { data } = await apiInstance.post('/admin/gallery', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return data
        }
    }
}

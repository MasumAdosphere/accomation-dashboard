export enum EConfigButtonType {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    TRANSPARENT = 'transparent'
}
export interface ArticleData {
    body: string
    category: {
        _id: string
        title: string
        feature: string
    }
    createdAt: Date
    slug: string
    tagline: string | null
    thumbnail: string
    title: string
    updatedAt: Date
    _id: string
}
export interface ITestimonial {
    _id: string
    name: string
    designation: string
    description: string
    slug: string
    image: string | null // 👈 nullable in case image is optional
    createdAt: string // ISO date string
    updatedAt: string // ISO date string
    __v?: number // version key (Mongoose)
}
export interface ICategory {
    createdAt: Date
    feature: string
    title: string
    updatedAt: Date
    _id: string
}
// Videos
export interface ICreateVideo {
    title: string
    link: string
    platform: string
    category: string | null
    formatType: string
}
export interface IMeta {
    total: number
    page: {
        pages: number
        current: number
        hasNext: boolean
        hasPrev: boolean
    }
}

export interface IGetVideos {
    _id: string
    category: {
        _id: string
        title: string
        feature: string
    }
    createdAt: Date
    formatType: string
    isFeatured: boolean
    link: string
    platform: string
    title: string
    updatedAt: Date
    meta: IMeta
}

// Audios
export interface IGetAudio {
    _id: string
    category: {
        _id: string
        title: string
        feature: string
    }
    createdAt: Date
    link: string
    title: string
    updatedAt: Date
    meta: IMeta
}
//users
export interface IUsers {
    consent: boolean
    createdAt: Date
    emailAddress: string
    gender: string
    lastLoginAt: Date
    name: string
    updatedAt: Date
    username: string
    verification: { status: boolean }
    whatsAppNumber: string
    _id: string
}

// Insights
export interface IInsights {
    articles: number
    categories: number
    users: number
}

export interface ArticlePayload {
    title: string
    category: string
    author: string
    content: string
    image?: string
    thumbnail?: string
}

export enum EConfigButtonType {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    THIRD = 'third',
    TRANSPARENT = 'transparent'
}
export enum EMediaType {
    IMAGE = 'image',
    VIDEO = 'video'
}
export interface ArticleData {
    body: string
    content: string
    category: {
        id: string
        title: string
        feature: string
    }
    createdAt: Date
    slug: string
    tagline: string | null
    thumbnail: string
    title: string
    updatedAt: Date
    id: string
}
export interface ITestimonial {
    id: string
    name: string
    designation: string
    description: string
    slug: string
    image: string | null // 👈 nullable in case image is optional
    createdAt: string // ISO date string
    updatedAt: string // ISO date string
    __v?: number // version key (Mongoose)
}
export interface IfaqPayload {
    question: string
    answer: String
    pageName: string
}
export interface ICreateUser {
    name: string
    email: String
    password: string
}

export interface ILogo {
    id: string
    companyName: string
    logo: string
    createdAt: string
    isPublished: boolean
}
export interface ICreatelogo {
    companyName: string
    logo: string
}
export interface ICareerCreate {
    jobrole: string
    employmentType: string
    location: string
    experience: string
    jobDescription: string
}
export interface IGallery {
    _id: string
    fileName: string
    mediaType: EMediaType
    currentUrl: string
    uploadedBy: {
        _id: string
        name: string
        emailAddress: string
    }
    createdAt: string
    updatedAt: string | null
}

// types/state.types.ts
export interface ICareer {
    id: string
    jobrole: string
    employmentType: 'fullTime' | 'partTime' | 'internship'
    location: string
    experience: string
    jobDescription: string
    createdAt: string
    updatedAt: string
    isPublished: boolean
}

export interface IFaq {
    id: string
    name: string
    designation: string
    question: string
    answer: String
    sequenceId: Number
    pageName: string
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
    id: string
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
    id: string
    category: {
        id: string
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
    id: string
    category: {
        id: string
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
    id: string
    name: string
    username: string
    email: string
    password: string
    lastLoginAt: Date | null
}

// Insights
export interface IInsights {
    totalAdmins: number
    totalTestimonials: number
    totalLiveJobPosts: number
    totalPublishedBlogs: number
}

export interface ArticlePayload {
    title: string
    category: string
    author: string
    content: string
    image?: string
    thumbnail?: string
}

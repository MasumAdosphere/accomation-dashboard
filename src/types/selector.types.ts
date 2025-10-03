export interface CommonState {
    error: string | null
    message: string | null
    loading: boolean
    currentPath: string
    isRefreshTokenError: boolean
    isDataRefreshed: string
    accessToken: string | null
}

export interface ISelf {
    _id: string
    name: string
    username: string
    emailAddress: string
    whatsAppNumber: string
    gender: string
    lastLogin: {
        timestamp: Date
    }
    createdAt: string
    editedAt: string
    permissions: string[]
}

export interface UserState {
    user: ISelf
}

export interface RootState {
    Common: CommonState
    User: UserState
}

export enum VideoPlatform {
    INSTAGRAM = 'Instagram',
    YOUTUBE = 'Youtube'
}

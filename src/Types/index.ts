import Baileys, { ParticipantAction, GroupMetadata } from '@whiskeysockets/baileys'

export * from './Config'
export * from './Command'
export * from './Message'
export * from './Pokemon'

export interface IContact {
    jid: string
    username: string
    isMod: boolean
}

export interface ISender extends IContact {
    isAdmin: boolean
}

export interface IGroup extends GroupMetadata {
    admins?: string[]
}

export interface ICall {
    content: {
        attrs: {
            'call-creator': string
        }
        tag: string
    }[]
}

export interface IEvent {
    jid: string
    participants: string[]
    action: ParticipantAction
}

export interface WaifuResponse {
    id?: string
    slug?: string
    name?: string
    original_name?: string
    romaji_name?: string
    display_picture?: string
    description?: string
    weight?: string | number
    height?: string | number
    bust?: string | number
    hip?: string | number
    waist?: string | number
    blood_type?: string
    origin?: string
    age?: number
    birthday_month?: string
    birthday_day?: number
    birthday_year?: string | number
    likes?: number
    trash?: number
    popularity_rank?: number
    like_rank?: number
    trash_rank?: number
    husbando?: boolean
    nsfw?: boolean
    creator?: { id: number; name: string }
    tags?: string[]
    url?: string
    appearances?: series[]
    series?: series
}

export interface series {
    name: string
    original_name?: string
    romaji_name?: string
    description?: string
    slug?: string
    airing_start?: string
    airing_end?: string
    episode_count?: string
    release?: string
    display_picture?: string
    studio?: string
}

export interface YT_Search {
    type: string
    videoId: string
    url: string
    title: string
    description: string
    image: string
    thumbnail: string
    seconds: number
    timestamp: string
    duration: {
        seconds: number
        timestamp: string
    }
    ago: string
    views: number
    author: {
        name: string
        url: string
    }
}

export interface AnimeSearch {
    title: {
        romaji: string
        english?: string
        native: string
    }
    status: string
    format: string
    isAdult: boolean
    duration?: number
    episodes?: number
    genres: string[]
    startDate: string
    endDate: string
    studios: string
    trailer?: {
        id: string
        site: string
        thumbnail: string
    }
    imageUrl: string
    description: string
}

export interface MangaSearch {
    title: {
        romaji: string
        english?: string
        native: string
    }
    status: string
    format: string
    isAdult: boolean
    genres: string[]
    startDate: string
    endDate: string
    volumes?: number
    chapters?: number
    trailer?: {
        id: string
        site: string
        thumbnail: string
    }
    imageUrl: string
    description: string
}

export interface CharacterSearch {
    characters: {
        name: {
            first: string
            last: string
            full: string
            native: string
        }
        age?: string
        gender?: string
        bloodType?: any
        image: {
            large: string
        }
        siteUrl: string
        description: string
    }[]
}

export interface IPokemonChainResponse {
    species: IPokemonSpecies
    evolves_to: IPokemonEvolvesTo[]
}

export interface IPokemonSpecies {
    name: string
}

export interface IPokemonEvolvesTo {
    species: IPokemonSpecies
    evolves_to: {
        species: IPokemonSpecies
    }[]
}

export type TCardsTier = '1' | '2' | '3' | '4' | '5' | '6' | 'S'

export type TGroupFeature = 'news' | 'events' | 'nsfw' | 'cards' | 'wild' | 'mods' | 'chara'

export type client = ReturnType<typeof Baileys>

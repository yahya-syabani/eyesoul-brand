import { TagType } from './TagType'

export interface BlogType {
    id: string,
    category: string,
    tag: string, // @deprecated - kept for backward compatibility, use tags instead
    tags?: Array<{ id: string; name: string; slug: string }>, // New tags relation
    title: string,
    date: string,
    author: string,
    avatar: string,
    thumbImg: string,
    coverImg: string,
    subImg: Array<string>,
    shortDesc: string,
    description: string,
}
import { BaseCommand, Command, Message } from '../../Structures'

@Command('instagram', {
    description: 'Sends post from Instagram',
    category: 'media',
    usage: 'insta [link]',
    aliases: ['igdl', 'insta'],
    exp: 25,
    cooldown: 10
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const pattern = /instagram\.com\/(?:p|tv|reel)\/[\w-]+\/?/
        const url = M.urls.find((url) => pattern.test(url))
        if (!url) return void M.reply('Provide a valid Instagram post URL, Baka!')
        const result = await this.client.utils.fetch<InstagramAPI>(`https://weeb-api.vercel.app/insta?url=${url}`)
        if (result.error) return void M.reply('Invalid URL or Private Post, Baka!')
        for (const { url, type } of result.urls) {
            const buffer = await this.client.utils.getBuffer(url)
            await M.reply(buffer, type, undefined, undefined, result.caption)
        }
    }
}

interface InstagramAPI {
    username: string
    name: string
    shortcode: string
    likes: number
    comment_count: number
    video_duration: number
    caption: string
    urls: {
        type: 'image' | 'video'
        url: string
    }[]
    error?: string
}

import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('pornsearch', {
    description: 'Will search porn from the given term.',
    category: 'nsfw',
    usage: 'pornsearch [term]',
    aliases: ['prns'],
    exp: 15,
    cooldown: 20
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void M.reply('Provide the search query, Baka!')
        let [query, number = 1] = context.trim().split('|')
        if (Number(number) > 5) return void M.reply('You can have 5 Videos at a time')
        const results = await this.client.utils.fetch<{ title: string; video: string; url: string; thumbnail: string }[]>(`https://nsfw-api-p302.onrender.com/r/video/search?q=${query}`)
        if (!results.length) return void M.reply('No results found')
        const videos = new Set()
        while (videos.size < Number(number)) {
            const { video: videoUrl } = results[Math.floor(Math.random() * results.length)]
            if (!videos.has(videoUrl)) {
                videos.add(videoUrl)
                const video = await this.client.utils.getBuffer(videoUrl)
                await this.client.sendMessage(M.from, { video }, { quoted: M.message })
            }
        }
    }
}

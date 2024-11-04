import { Message, Command, BaseCommand } from '../../Structures'
import { IArgs, YT_Search } from '../../Types'

@Command('yts', {
    description: 'Searches the video of the given query in YouTube',
    category: 'media',
    cooldown: 10,
    exp: 10,
    usage: 'yts [query]',
    aliases: ['ytsearch']
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void M.reply('Provide a query, Baka!')
        const query = context.trim()
        M.reply('*🤹🏻‍♀️ Searching...*')
        const videos = await this.client.utils.fetch<YT_Search[]>(`https://weeb-api.vercel.app/ytsearch?query=${query}`)
        if (!videos || !videos.length) return void M.reply(`No videos found | *"${query}"*`)
        let text = ''
        const length = videos.length >= 10 ? 10 : videos.length
        for (let i = 0; i < length; i++)
            text += `*#${i + 1}*\n🪗 *Title: ${videos[i].title}*\n🎬 *Channel: ${
                videos[i].author.name
            }*\n🎞️ *Duration: ${videos[i].seconds}s*\n🪩 *URL: ${videos[i].url}*\n\n`
        return void (await M.reply(text, 'text', undefined, undefined, undefined, undefined, {
            title: videos[0].title,
            thumbnail: await this.client.utils.getBuffer(videos[0].thumbnail),
            mediaType: 2,
            body: videos[0].description,
            mediaUrl: videos[0].url
        }))
    }
 }
        

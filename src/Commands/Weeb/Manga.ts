import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs, MangaSearch } from '../../Types'

@Command('manga', {
    description: 'Searches a manga of the given query.',
    category: 'weeb',
    exp: 10,
    usage: 'manga [query]',
    cooldown: 10
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void M.reply('Provide a query for the search, Baka!')
        const query = context.trim()
        await this.client.utils
            .fetch<MangaSearch[]>(`https://weeb-api.vercel.app/manga?search=${query}`)
            .then(async (data) => {
                if (!data.length) return void M.reply('Not Found - Invalid Input')
                let text = ''
                text += `*${data[0].title.english}* *|* *${data[0].title.romaji}*\n`
                text += `◉ *Japanese:* *${data[0].title.native}*\n`
                text += `◉ *Type:* ${data[0].format}\n`
                text += `◉ *Is-Adult:* ${data[0].isAdult}\n`
                text += `◉ *Status:* ${data[0].status}\n`
                text += `◉ *Chapters:* ${data[0].chapters}\n`
                text += `◉ *Volumes:* ${data[0].volumes}\n`
                text += `◉ *First Aired:* ${data[0].startDate}\n`
                text += `◉ *Last Aired:* ${data[0].endDate}\n`
                text += `◉ *Genres:* ${data[0].genres.join(', ')}\n`
                text += `◉ *Trailer:* https://youtu.be/${data[0].trailer ? data[0].trailer.id : 'null'}\n\n`
                text += `*──「 Description:* ${data[0].description}`
                const image = await this.client.utils.getBuffer(data[0].imageUrl)
                return void (await M.reply(image, 'image', undefined, undefined, text))
            })
            .catch(() => {
                return void M.reply(`Couldn't find any manga | *"${query}"*`)
            })
    }
}

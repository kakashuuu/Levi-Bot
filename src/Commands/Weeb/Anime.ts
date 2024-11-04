import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs, AnimeSearch } from '../../Types'

@Command('anime', {
    description: 'Searches an anime of the given query',
    aliases: ['ani'],
    category: 'weeb',
    usage: 'anime [query]',
    exp: 20,
    cooldown: 10
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void M.reply('Provide a query for the search, Baka!')
        const query = context.trim()
        await this.client.utils
            .fetch<AnimeSearch[]>(`https://weeb-api.vercel.app/anime?search=${query}`)
            .then(async (data) => {
                if (!data.length) return void M.reply('Not Found - Invalid Input')
                let text = ''
                text += `*${data[0].title.english}* *|* *${data[0].title.romaji}*\n`
                text += `◉ *Japanese:* *${data[0].title.native}*\n`
                text += `◉ *Type:* ${data[0].format}\n`
                text += `◉ *Is-Adult:* ${data[0].isAdult}\n`
                text += `◉ *Status:* ${data[0].status}\n`
                text += `◉ *Episodes:* ${data[0].episodes}\n`
                text += `◉ *Duration:* ${data[0].duration} Per Ep.\n`
                text += `◉ *First Aired:* ${data[0].startDate}\n`
                text += `◉ *Last Aired:* ${data[0].endDate}\n`
                text += `◉ *Genres:* ${data[0].genres.join(', ')}\n`
                text += `◉ *Studios:* ${data[0].studios}\n`
                text += `◉ *Trailer:* https://youtu.be/${data[0].trailer ? data[0].trailer.id : 'null'}\n\n`
                text += `*──「 Description:* ${data[0].description}`
                const image = await this.client.utils.getBuffer(data[0].imageUrl)
                return void (await M.reply(image, 'image', undefined, undefined, text))
            })
            .catch(() => {
                return void M.reply(`Couldn't find any anime | *"${query}"*`)
            })
    }
}

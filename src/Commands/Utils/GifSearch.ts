import { BaseCommand, Message, Command } from '../../Structures'
import { IArgs } from '../../Types'

interface IGifyResponse {
    media: {
        mp4: {
            url: string
        }
    }[]
}

@Command('gifsearch', {
    aliases: ['gify'],
    description: 'Sends a gif of a given topic',
    category: 'utils',
    usage: 'gify [query]',
    exp: 10
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void (await M.reply('Sorry you did not give any search term!'))
        const data: { results: IGifyResponse[] } = await this.client.utils.fetch(
            `https://g.tenor.com/v1/search?q=${context}&key=LIVDSRZULELA&limit=8`
        )
        const video = await this.client.utils.getBuffer(
            data.results?.[Math.floor(Math.random() * data.results.length)]?.media[0]?.mp4?.url as string
        )

        return void (await M.reply(video, 'video', true, undefined, `Here you go`, undefined))
    }
}

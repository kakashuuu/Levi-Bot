import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('hentaiclips', {
    description: 'get Hentai Clips Of Searched Query If available on site',
    category: 'nsfw',
    usage: 'hentaiclips',
    aliases: ['hc'],
    exp: 15,
    cooldown: 20
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void (await M.reply('Provide query of image'))
        const texas = context.trim().split('|')
        const term = texas[0]
        const amount = parseInt(texas[1])
        if (!amount)
            return void M.reply(
                `*Give me the number, Baka!*\n\n*🚀Example: ${this.client.config.prefix}rule34 tsunade|5*`
            )
        if (amount > 10) return void M.reply(`Do you want me to spam in this group?`)
        for (let i = 0; i < amount; i++) {
            const data = await this.client.utils.fetch<string[]>(
                `https://kakashi-weeb.onrender.com/h/video/search?q=${term}`
            )
            if (!data.length)
                return void (await M.reply('*404 Error! Found no Results Please try again from the List*'))
            const buffer = await this.client.utils.getBuffer(data[Math.floor(Math.random() * data.length)])
            await M.reply(buffer, 'video').catch(() => {
                return void M.reply('An error occurred. Try again later')
            })
        }
    }
}
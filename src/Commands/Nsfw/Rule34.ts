import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('rule34', {
    description: 'Will search img On Rule34 from the given term but you have to manage quality stuff its not high one use rule command single image but usefull.',
    category: 'nsfw',
    usage: 'rule34',
    aliases: ['rule34'],
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
        if (amount > 20) return void M.reply(`Do you want me to spam in this group?`)
        for (let i = 0; i < amount; i++) {
            const data = await this.client.utils.fetch<string[]>(
                `https://nsfw-api-p302.onrender.com/h/image/search?q=${term}`
            )
            if (!data.length)
                return void (await M.reply('*404 Error! Found no Results Please try again from the List*'))
            const buffer = await this.client.utils.getBuffer(data[Math.floor(Math.random() * data.length)])
            await M.reply(buffer, 'image').catch(() => {
                return void M.reply('An error occurred. Try again later')
            })
        }
    }
}

import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import axios from 'axios'

@Command('chat', {
    description: 'Chat with the Bot in group.',
    category: 'core',
    usage: 'chat hi',
    aliases: ['bot'],
    exp: 15,
    cooldown: 3
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const text = context.trim()
        const myUrl = this.client.config.chatBotUrl
        if (!myUrl) return void M.reply(`Chat Bot Url not set.`)
        if (!context) return void M.reply(`Whats up? I'm ${this.client.config.name}`)
        let get = new URL(myUrl)
        let params = get.searchParams
        const response = await axios.get(
            `${encodeURI(
                `http://api.brainshop.ai/get?bid=${params.get('bid')}&key=${params.get('key')}&uid=${
                    M.from
                }&msg=${text}`
            )}`
        )
        await M.reply(response.data.cnt).catch(() => {
            return void M.reply('An error occurred. Try again later')
        })
    }
}

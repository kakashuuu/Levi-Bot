import { Sticker } from 'wa-sticker-formatter'
import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('gamble', {
    description: '',
    usage: '',
    category: 'economy',
    cooldown: 25,
    exp: 20,
    casino: true
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { args }: IArgs): Promise<void> => {
        const directions = ['left', 'right'] as TGamblingDirections[]
        if (M.numbers.length < 1 || args.length < 1)
            return void M.reply(`🟥 Invalid usage! Example: *${this.client.config.prefix}gamble right 500*`)
        const amount = M.numbers[0]
        if (amount < 100) return void M.reply(`🟥 *You can't gamble less than 100 gold.*`)
        const { wallet } = await this.client.DB.getUser(M.sender.jid)
        if (amount > wallet) return void M.reply(`🟥 *You may want to check your wallet.*`)
        if (amount > 15000) return void M.reply(`🟥 *You can't gamble more than 15000 gold.*`)
        const direction = args[1]
        const result = directions[Math.floor(Math.random() * directions.length)]
        await this.client.DB.setMoney(M.sender.jid, result === direction ? amount : -amount)
        const sticker = await new Sticker(this.client.assets.get(result) as Buffer, {
            pack: 'ᴹᴿ᭄ ᴋᴀᴋᴀsʜɪོ ×፝֟͜×',
            author: `Levi`,
            quality: 90,
            type: 'full'
        }).build()
        await M.reply(sticker, 'sticker')
        return void (await M.reply(
            result === direction ? `*🎊🎊 You won ${amount} golds.*` : `*🥀🥀 You lost ${amount} golds*.`
        ))
    }
}

type TGamblingDirections = 'left' | 'right'

import { BaseCommand, Command, Message } from '../../Structures'

@Command('bid', {
    description: 'set bids for cards( Dalali Ke liye boli)',
    usage: 'boli',
    cooldown: 15,
    exp: 5,
    category: 'cards'
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const card = this.handler.auction.get(M.from)
        const bit = this.handler.highestBit.get(M.from)
        if (M.sender.jid === card?.seller) return void (await M.reply('*Bc You cant bid your own hosted auction!!*'))
        if (M.numbers.length < 1) return void M.reply('🟥 Specify the amount of gold you want to bid.')
        const { wallet } = await this.client.DB.getUser(M.sender.jid)
        if (M.numbers[0] > wallet) return void M.reply(`🟥 You may want to check your wallet.`)
        if (M.numbers[0] < card?.price!)
            return void (await M.reply(`🟥 *You can not bid less than ${card?.price!} gold*`))
        if (M.numbers[0] > 90000000000000000000000000000000000000000000000000000000000)
            return void (await M.reply(
                `🟥 *You can not bit over than 90000000000000000000000000000000000000000000000000000000000 gold*`
            ))
        if (!card) return void (await M.reply("There aren't any available auction to bit!"))
        if (bit?.bit! > M.numbers[0])
            return void (await M.reply(`You can not bit on that card less than ${bit?.bit!} gold!`))
        this.handler.highestBit.set(M.from, { bit: M.numbers[0], buyer: M.sender.jid })
        await M.reply(`Your bit has been set for *${card.card.name} - ${card.card.tier}*`)
    }
}

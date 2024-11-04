import { SlotMachine, SlotSymbol } from 'slot-machine'
import { BaseCommand, Command, Message } from '../../Structures'

@Command('slot', {
    category: 'economy',
    description: 'Bets the given amount of gold in a slot machine',
    casino: true,
    usage: 'slot <amount>',
    cooldown: 25,
    exp: 10,
    aliases: ['bet']
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (M.numbers.length < 1) return void M.reply(`🟥 *You don't have sufficient amount of gold to bet*.`)
        const amount = M.numbers[0]
        if (amount < 100) return void M.reply(`🟥 *You can't bet  less than 100 gold.*`)
        const { wallet } = await this.client.DB.getUser(M.sender.jid)
        if (amount > 50000) return void M.reply(`🟥 *You can't bet more than 50000 gold!*`)
        if (amount > wallet) return void M.reply(`🟥 *You may want to check  your wallet.*`)
        const machine = new SlotMachine(3, this.symbols)
        const results = machine.play()
        const lines = results.lines.filter((line) => !line.diagonal)
        const points = results.lines.reduce((total, line) => total + line.points, 0)
        const resultAmount = points <= 0 ? -amount : amount * points
        await this.client.DB.setMoney(M.sender.jid, resultAmount)
        let text = '🎰 *SLOT MACHINE* 🎰\n\n'
        text += results.visualize()
        text += points <= 0 ? `\n\n*📉 You lost ${amount} gold🪙*.` : `\n\n*📈 You won ${resultAmount} gold 🪙*.`
        return void (await M.reply(text, 'text'))
    }

    private symbols = [
        new SlotSymbol('1', {
            display: '💮',
            points: 1,
            weight: 100
        }),
        new SlotSymbol('2', {
            display: '☘',
            points: 1,
            weight: 100
        }),
        new SlotSymbol('b', {
            display: '🌸',
            points: 5,
            weight: 40
        })
    ]
}

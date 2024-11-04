import { BaseCommand, Command, Message } from '../../Structures'

@Command('deposit', {
    description: '',
    usage: '',
    cooldown: 15,
    exp: 5,
    category: 'economy'
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (M.numbers.length < 1) return void M.reply('🟥 Specify the amount of gold you want to deposit.')
        const { wallet } = await this.client.DB.getUser(M.sender.jid)
        if (M.numbers[0] > wallet) return void M.reply(`🟥 You may want to check your wallet.`)
        await this.client.DB.setMoney(M.sender.jid, M.numbers[0], 'bank')
        await this.client.DB.setMoney(M.sender.jid, -M.numbers[0])
        return void (await M.reply(`🟩 You deposited *${M.numbers[0]}* Golds to your bank.`))
    }
}

import { BaseCommand, Command, Message } from '../../Structures'

@Command('withdraw', {
    description: '',
    usage: '',
    cooldown: 15,
    exp: 5,
    category: 'economy'
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (M.numbers.length < 1)
            return void M.reply(`🟥 *You don't have sufficient amount of gold in your bank to make this transaction*.`)
        const { bank } = await this.client.DB.getUser(M.sender.jid)
        if (M.numbers[0] > bank) return void M.reply(`🟥 You may want to check your bank.`)
        await this.client.DB.setMoney(M.sender.jid, -M.numbers[0], 'bank')
        await this.client.DB.setMoney(M.sender.jid, M.numbers[0])
        return void (await M.reply(`🟩 You withdrew *${M.numbers[0]}* golds to your wallet.`))
    }
}

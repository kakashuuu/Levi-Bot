import { BaseCommand, Command, Message } from '../../Structures'

@Command('give', {
    category: 'economy',
    description: '',
    usage: '',
    exp: 25,
    cooldown: 10
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const users = M.mentioned
        if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)
        if (!users.length || users.length < 0) return void M.reply('Tag or quote a user to give money.')
        if (users[0] === M.sender.jid) return void M.reply('Please tag someone.')
        if (M.numbers.length < 1)
            return void M.reply(`🟥 *You don't have sufficient amount of dollars in your wallet to give*.`)
        const user = users[0]
        const { wallet } = await this.client.DB.getUser(M.sender.jid)
        const amount = M.numbers[0]
        if (amount > wallet) return void M.reply(`🟥 You may want to check your wallet.`)
        await this.client.DB.setMoney(M.sender.jid, -amount)
        await this.client.DB.setMoney(user, amount)
        return void M.reply(
            `🟩 You gave *${amount}* gold to @${user.split('@')[0]}`,
            'text',
            undefined,
            undefined,
            undefined,
            [M.sender.jid, user]
        )
    }
}

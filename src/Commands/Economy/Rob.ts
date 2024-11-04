import { BaseCommand, Command, Message } from '../../Structures'

@Command('rob', {
    description: '',
    category: 'economy',
    usage: '',
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (M.from === this.client.config.casinoGroup)
            return void M.reply("🟥 You can't rob here! Try somewhere else, baka!")
        const time = 900000
        const { lastRob: cd } = await this.client.DB.getUser(M.sender.jid)
        if (time - (Date.now() - cd) > 0) return void M.reply('You recently tried to rob, wait for sometime.')
        const { wallet } = await this.client.DB.getUser(M.sender.jid)
        const target = M.quoted && M.mentioned.length === 0 ? M.quoted.sender.jid : M.mentioned[0] || ''
        if (target === '' || target === M.sender.jid) return void M.reply('Tag or quote a user you want to rob.')
        const { wallet: Wallet } = await this.client.DB.getUser(target)
        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { lastRob: Date.now() } })
        const result = this.getResultByProbability(0.1)
        let targetAmount = Math.floor(Math.random() * (Wallet - 250) + 250)
        if (Wallet >= 10000) targetAmount = Math.floor(Math.random() * 10000)
        let userAmount = Math.floor(Math.random() * (wallet - 250) + 250)
        if (userAmount >= 10000) userAmount = Math.floor(Math.random() * 10000)
        await this.client.DB.setMoney(M.sender.jid, result === 'success' ? targetAmount : -userAmount)
        await this.client.DB.setMoney(target, result === 'success' ? -targetAmount : userAmount)
        const text =
            result === 'caught'
                ? `opps!!! You got caught and paid *${userAmount} gold* to *@${target.split('@')[0]}*`
                : `*@${M.sender.jid.split('@')[0]}* robbed *@${
                      target.split('@')[0]
                  }* and got away with *${targetAmount} dollars!*`
        return void M.reply(text, 'text', undefined, undefined, undefined, [M.sender.jid, target])
    }

    private getResultByProbability = (n: number): 'caught' | 'success' => {
        if (Math.random() < n) return 'success'
        return 'caught'
    }
}

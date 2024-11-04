import { BaseCommand, Command, Message } from '../../Structures'

@Command('bonus', {
    category: 'economy',
    description: 'get a one-time bonus',
    usage: 'bonus',
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const bonusAmount = 100000
        const { claimedBonus } = await this.client.DB.getUser(M.sender.jid)

        if (claimedBonus) {
            return void M.reply('🟨 You already claimed your welcome bonus.')
        }

        await this.client.DB.setMoney(M.sender.jid, bonusAmount)
        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { claimedBonus: true } })

        return void (await M.reply(`*🎉 Successfully Claimed ${bonusAmount} Golds As Welcome  bonus!*`))
    }
}

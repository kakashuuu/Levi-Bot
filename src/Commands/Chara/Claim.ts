import { Command, BaseCommand, Message } from '../../Structures'

@Command('claim', {
    description: 'claims charactr',
    exp: 10,
    cooldown: 10,
    usage: 'claim',
    category: 'characters'
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const res = this.handler.charaResponse.get(M.from)
        if (!res) return void M.reply('no chara to claim')
        const { wallet, gallery } = await this.client.DB.getUser(M.sender.jid)
        if (res.price > wallet) return void M.reply(`Lol Check your wallet you don't have such gold to claim this`)
        this.handler.charaResponse.delete(M.from)
        await this.client.DB.updateUser(M.sender.jid, 'wallet', 'inc', -res.price)
        gallery.push(res.data)
        await this.client.DB.updateUser(M.sender.jid, 'gallery', 'set', gallery)
        return void M.reply(
            `🎉 congratulations 🎉 ❤You have claimed ${res.data.name} character it has been send to your gallery`
        )
    }
}

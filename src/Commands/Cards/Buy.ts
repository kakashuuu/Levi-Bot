import { Command, BaseCommand, Message } from '../../Structures'
import { TCardsTier } from '../../Types'

@Command('buy-card', {
    description: 'buy cards from shop',
    usage: 'buy-card',
    category: 'cards',
    cooldown: 15,
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const data = this.handler.shop.get(M.from) as {
            title: string
            tier: string
            url: string
        }[]
        const { deck, cardCollection: collection, wallet } = await this.client.DB.getUser(M.sender.jid)
        if (!M.numbers[0]) return void M.reply('Index is missing')
        const i = M.numbers[0] - 1
        if (i >= 70) return void M.reply('Index is invalid')
        if (700000 > wallet)
            return void M.reply(`🟥 *You need ${700000 - wallet} more money in your wallet to buy this card*`)
        let flag = false
        if (deck.length >= 12) flag = true
        flag
            ? collection.push({
                  name: data[i].title,
                  tier: data[i].tier as TCardsTier,
                  image: data[i].url,
                  id: data[i].url.split('/cardr/')[1],
                  url: `https://shoob.gg/cards/info/${data[i].url.split('/cardr/')[1]}`,
                  description: data[i].title + ' ' + 'From ' + '🔮 Levi.inc Store 🔮'
              })
            : deck.push({
                  name: data[i].title,
                  tier: data[i].tier as TCardsTier,
                  image: data[i].url,
                  id: data[i].url.split('/cardr/')[1],
                  url: `https://shoob.gg/cards/info/${data[i].url.split('/cardr/')[1]}`,
                  description: data[i].title + ' ' + 'From ' + '🔮 Levi.inc Store 🔮'
              })
        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { deck, cardCollection: collection } })
        await this.client.DB.removeMoney(M.sender.jid, 50000)
        return void (await M.reply(
            `🎉 You have bought *${data[i].title} - ${
                data[i].tier
            }* From The Levi.inc Store. It has been added in your ${flag ? 'collection.' : 'deck.'}`
        ))
    }
}

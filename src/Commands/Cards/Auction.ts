import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types/Message'

@Command('auction', {
    category: 'cards',
    description: 'Auction of cards',
    usage: '[index of the card from you deck] [lowest bit]',
    cooldown: 15,
    exp: 35,
    antiTrade: true
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { args }: IArgs): Promise<void> => {
        const position = parseInt(args[0], 10) - 1
        const price = parseInt(args[1])
        const { deck } = await this.client.DB.getUser(M.sender.jid)
        if (deck.length < 1) return void M.reply("You don't have any cards in your deck")
        if (isNaN(price)) return void (await M.reply('🟥 *Invalid price*'))
        if (price > 90000000000000) return void (await M.reply('🟥 *You can not set the minimum value to 90000000000000 Golds*'))
        if (isNaN(position)) return void (await M.reply('🟥 *Invalid card index*'))
        if (position < 0 || position >= deck.length) return void (await M.reply('🟥 *Invalid card index*'))
        const card = deck[position]
        if (!card) return void (await M.reply('🟥 *Invalid card index*'))
        this.handler.auction.set(M.from, { seller: M.sender.jid, card, price, position })
        await M.reply(
            `⛩️ *Auction has started for card ${card.name} - ${card.tier} by @${
                M.sender.jid.split('@')[0]
            } the lowest bit is ${price} Golds* ⛩️ \n _It will last for 5 minute only_`,
            'text',
            undefined,
            undefined,
            undefined,
            [M.sender.jid]
        )

        setTimeout(async () => {
            const data = this.handler.auction.get(M.from)
            const winner = this.handler.highestBit.get(M.from)
            if (!winner) return void (await M.reply('🟩 *Auction has been ended!! no winner!!*'))
            const { deck: targetdeck = [] } = await this.client.DB.getUser(data?.seller!)
            const { cardCollection: collec, deck } = await this.client.DB.getUser(winner?.buyer!)
            let text = 'It is now in your deck'
            if (deck.length < 12) deck.push(data?.card!)
            else {
                collec.push(data?.card!)
                text = `It has been stored in your collection`
            }
            await this.client.DB.user.updateOne(
                { jid: winner?.buyer! },
                {
                    $set: {
                        cardCollection: collec,
                        deck
                    },
                    $inc: {
                        credits: -winner?.bit!
                    }
                }
            )
            targetdeck.splice(data?.position!, 1)
            await await this.client.DB.user.updateOne(
                { jid: data?.seller! },
                { $set: { deck: targetdeck }, $inc: { credits: winner?.bit! } }
            )
            this.handler.auction.delete(M.from)
            this.handler.highestBit.delete(M.from)
            await M.reply(
                '🟩 *Auction has been ended!!*\n\n' +
                    `@${winner?.buyer!.split('@')[0]} got ${data?.card!.name} - ${
                        data?.card!.tier
                    } for ${winner?.bit!} cradits* \n_${text}_`,
                'text',
                undefined,
                undefined,
                undefined,
                [winner?.buyer!]
            )
        }, 300000)
    }
}

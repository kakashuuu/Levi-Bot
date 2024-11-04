import { Message, Command, BaseCommand } from '../../Structures'

@Command('gcard', {
    description: 'Gives card to people',
    usage: 'gcard [index of deck]',
    exp: 10,
    cooldown: 10,
    category: 'cards'
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const { deck } = await this.client.DB.getUser(M.sender.jid)
        if (!deck.length) return void M.reply('You have not claimed any card')
        if (!M.numbers.length || M.numbers[0] < 1 || M.numbers[0] > deck.length)
            return void M.reply('Provide a valid deck index to give with tagged or quoted person')
        const jid = M.mentioned.length ? M.mentioned[0] : M.quoted ? M.quoted.sender.jid : ''
        if (!jid) return void M.reply('Tag or quote is required!!')
        if (M.sender.jid === jid) return void M.reply('You stop cheating around, Bakano')
        if (this.handler.auction.get(M.from)) return void M.reply('Auction is Ongoing, Baka!')
        console.log(deck, '\n')
        const index = M.numbers[0] - 1
        const card = deck[index]
        console.log(card, '\n')
        const { deck: Deck, cardCollection } = await this.client.DB.getUser(jid)
        console.log(Deck, cardCollection, '\n')
        const target = Deck.length >= 12 ? cardCollection : Deck
        target.push(card)
        deck.splice(index, 1)
        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { deck } })
        await this.client.DB.user.updateOne({ jid }, { $set: { deck: Deck, cardCollection } })
        return void M.reply(
            `🎉 @${M.sender.jid.split('@')[0]} gave ${card.name} to @${jid.split('@')[0]}`,
            'text',
            undefined,
            undefined,
            undefined,
            [M.sender.jid, jid]
        )
    }
}

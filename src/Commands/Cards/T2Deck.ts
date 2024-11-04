import { BaseCommand, Command, Message } from '../../Structures'

@Command('t2deck', {
    category: 'cards',
    description: "Transfers a card in a user's collection to the deck",
    usage: 't2deck <index_number_of_a_card_in_your_deck>',
    cooldown: 15,
    exp: 35,
    antiTrade: true
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const { deck, cardCollection } = await this.client.DB.getUser(M.sender.jid)
        if (M.numbers.length < 2)
            return void M.reply(
                'Provide the index number of a card in your collection that you wanna store in your deck'
            )
        const i = M.numbers[1]
        if (i < 1 || i > cardCollection.length) return void M.reply('Invalid index number of a card in your collection')
        if (deck.length >= 12) return void M.reply('🟨 *Your deck is full*')
        const data = cardCollection[i - 1]
        deck.push(data)
        cardCollection.splice(i - 1, 1)
        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { deck, cardCollection } })
        return void (await M.reply(`*${data.name} - ${data.tier}* has been stored in your deck`))
    }
}

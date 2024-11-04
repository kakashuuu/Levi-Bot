import { BaseCommand, Command, Message } from '../../Structures'

@Command('cards-shop', {
    description: 'Buy Cards From The shop',
    category: 'cards',
    usage: 'cs',
    cooldown: 10,
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        this.handler.shop.delete(M.from)
        const cards = (
            await await this.client.utils.fetch<{ title: string; url: string; tier: string }[]>(
                'https://gist.githubusercontent.com/Debanjan-San/c30744db30923822a5dece3679e89906/raw/eab3b376b234f12126ebce195f386b82bd6b4376/cards.json'
            )
        ).filter((I) => {
            return I.tier == 'S'
        })

        const cardsData = this.client.utils.getRandomItems(cards, 20)
        this.handler.shop.set(M.from, cardsData)
        let text = '*🃏✨ Levi Inc Tier S Store ✨🃏*\n\n'
        await this.client.sendMessage(M.from, {
            video: { url: cardsData[0].url },
            gifPlayback: true,
            caption: `${text} ${cardsData
                .map((card, i) => `# *${i + 1}*\n🃏 Card Name: ${card.title}\n🔮Tier: ${card.tier}`)
                .join('\n\n')}`
        })
    }
}

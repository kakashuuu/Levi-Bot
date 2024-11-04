import { BaseCommand, Command, Message } from '../../Structures'
import { Collage } from '../../lib'

@Command('deck', {
    description: "Displays user's deck",
    cooldown: 15,
    category: 'cards',
    usage: 'deck',
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const { deck, tag } = await this.client.DB.getUser(M.sender.jid)
        if (deck.length < 1) return void M.reply("You don't have any cards in your deck")
        if (M.numbers.length < 1 || M.numbers[0] > deck.length) {
            let caption = `🀄 *DECK* 🀄\n\n*🎴 Username:*  ${M.sender.username}\n`
            for (let i = 0; i < deck.length; i++)
                caption += `\n*#${i + 1}*\n*🃏 Name:* ${deck[i].name}\n🔰 *Tier:* ${deck[i].tier}\n`
            let image = await new Collage(deck.map((i) => i.image)).toBuffer()
            return void (await this.client.sendMessage(M.from, { image, caption }))
        } else {
            const i = M.numbers[0] - 1
            const { name, image, tier, description } = deck[i]
            let buffer = await this.client.utils.getBuffer(image)
            const video = /\.(gif|mp4)$/.test(image)
            if (image.endsWith('.gif')) buffer = await this.client.utils.gifToMp4(buffer)
            const text = `*🃏Name:* ${name}\n*📑Description:* ${description}\n*🎗Tier:* ${tier}`
            return void (await M.reply(
                buffer,
                video ? 'video' : 'image',
                video,
                undefined,
                text
            ))
        }
    }
}

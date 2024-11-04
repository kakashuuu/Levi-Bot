import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('collection', {
    description: "Displays user's collection of cards",
    cooldown: 15,
    category: 'cards',
    usage: 'collection',
    exp: 10,
    aliases: ['collec', 'coll']
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const { cardCollection, tag } = await this.client.DB.getUser(M.sender.jid)
        if (cardCollection.length < 1) return void M.reply("You don't have any cards in your collection!")
        if (isNaN(Number(context))) {
            const results: string[] = cardCollection
                .map(({ name, tier }, index) => `${index + 1}. ${name} | Tier: ${tier}`)
                .filter((result) => result.toLowerCase().includes(context.toLowerCase()))
            if (!results.length) return void M.reply('Not Found')
            return void (await M.reply(results.join('\n')))
        }
        if (M.numbers.length < 1 || M.numbers[0] > cardCollection.length) {
            let text = `🃏 *Collection*\n\n🎴 *ID:*\n🏮 *Username:* ${M.sender.username}\n\🧧 *Tag:* #${tag}\n\n`
            for (let i = 0; i < cardCollection.length; i++)
                text += `\n*#${i + 1}* ${cardCollection[i].name} (Tier ${cardCollection[i].tier})`
            const { image, tier } = cardCollection[0]
            let buffer = await this.client.utils.getBuffer(image)
            const video = /\.(gif|mp4)$/.test(image)
            if (image.endsWith('.gif')) buffer = await this.client.utils.gifToMp4(buffer)
            return void (await M.reply(
                buffer,
                video ? 'video' : 'image',
                video,
                undefined,
                text
            ))
        } else {
            const i = M.numbers[0] - 1
            const { name, image, tier, description } = cardCollection[i]
            let buffer = await this.client.utils.getBuffer(image)
            const video = /\.(gif|mp4)$/.test(image)
            if (image.endsWith('.gif')) buffer = await this.client.utils.gifToMp4(buffer)
            const text = `*🎴Name:* ${name}\n*📑Description:* ${description}\n*🏹Tier:* ${tier}`
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

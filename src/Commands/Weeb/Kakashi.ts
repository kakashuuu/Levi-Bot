import { BaseCommand, Command, Message } from '../../Structures'

@Command('kakashi', {
    description: 'Sends a random kakashi image',
    category: 'weeb',
    usage: 'kakashi',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async ({ reply }: Message): Promise<void> => {
        const buffer = await this.client.utils.getBuffer(
            'https://api.zeeoneofc.my.id/api/anime/kakashi?apikey=yKnbariIPTghPaX'
        )
        return void (await reply(buffer, 'image'))
    }
}

import { BaseCommand, Command, Message } from '../../Structures'

@Command('megumin', {
    description: 'Sends a random megumin image',
    category: 'weeb',
    usage: 'megumin',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async ({ reply }: Message): Promise<void> => {
        const { url } = await this.client.utils.fetch<{ url: string }>('https://api.waifu.pics/sfw/megumin')
        return void (await reply(await this.client.utils.getBuffer(url), 'image'))
    }
}

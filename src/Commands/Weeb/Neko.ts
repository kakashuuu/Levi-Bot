import { BaseCommand, Command, Message } from '../../Structures'

@Command('neko', {
    description: 'Sends a random fox_girl image',
    category: 'weeb',
    usage: 'neko',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async ({ reply }: Message): Promise<void> => {
        const { url } = await this.client.utils.fetch<{ url: string }>('https://api.waifu.pics/sfw/neko')
        return void (await reply(await this.client.utils.getBuffer(url), 'image'))
    }
}

import { BaseCommand, Command, Message } from '../../Structures'

@Command('waifu', {
    description: 'Sends a random waifu image',
    category: 'weeb',
    usage: 'waifu',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async ({ reply }: Message): Promise<void> => {
        const { url } = await this.client.utils.fetch<{ url: string }>('https://api.waifu.pics/sfw/waifu')
        return void (await reply(await this.client.utils.getBuffer(url), 'image'))
    }
}

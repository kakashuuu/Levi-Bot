import { BaseCommand, Command, Message } from '../../Structures'

@Command('shemale', {
    description: 'Sends a random shemale image',
    category: 'nsfw',
    usage: 'shemale',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async ({ reply }: Message): Promise<void> => {
        const { url } = await this.client.utils.fetch<{ url: string }>('https://api.waifu.pics/nsfw/trap')
        return void (await reply(await this.client.utils.getBuffer(url), 'image'))
    }
}

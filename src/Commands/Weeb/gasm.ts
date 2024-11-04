import { BaseCommand, Command, Message } from '../../Structures'

@Command('gasm', {
    description: 'Sends a random nsfw image',
    category: 'weeb',
    usage: '',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async ({ reply }: Message): Promise<void> => {
        const { url } = await this.client.utils.fetch<{ url: string }>('https://nekos.life/api/v2/img/gasm')
        return void (await reply(await this.client.utils.getBuffer(url), 'image'))
    }
}

import { BaseCommand, Command, Message } from '../../Structures'

@Command('avatar', {
    description: 'Sends a random avatar image',
    category: 'weeb',
    usage: 'avatar',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async ({ reply }: Message): Promise<void> => {
        const { url } = await this.client.utils.fetch<{ url: string }>('https://nekos.life/api/v2/img/avatar')
        return void (await reply(await this.client.utils.getBuffer(url), 'image'))
    }
}

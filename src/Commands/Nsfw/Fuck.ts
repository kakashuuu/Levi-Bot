import { BaseCommand, Command, Message } from '../../Structures'

@Command('fuck', {
    description: 'test',
    category: 'nsfw',
    usage: 'fuck',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async ({ reply }: Message): Promise<void> => {
        const { link } = await this.client.utils.fetch<{ link: string }>('https://purrbot.site/api/img/nsfw/fuck/gif')
        const buffer = await this.client.utils.getBuffer(link)
        return void (await reply(await this.client.utils.gifToMp4(buffer), 'video', true))
    }
}

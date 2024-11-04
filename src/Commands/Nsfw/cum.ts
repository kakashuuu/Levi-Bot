import { BaseCommand, Command, Message } from '../../Structures'

@Command('cum', {
    description: 'shows u cum girl',
    category: 'nsfw',
    usage: 'cum',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async ({ reply }: Message): Promise<void> => {
        const { link } = await this.client.utils.fetch<{ link: string }>('https://purrbot.site/api/img/nsfw/cum/gif')
        const buffer = await this.client.utils.getBuffer(link)
        return void (await reply(await this.client.utils.gifToMp4(buffer), 'video', true))
    }
}

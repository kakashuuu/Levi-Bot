import { BaseCommand, Command, Message } from '../../Structures'

@Command('kushina_uzumaki', {
    description: 'Sends a random nsfw image',
    category: 'nsfw',
    usage: 'kushina_uzimaki',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async ({ reply }: Message): Promise<void> => {
        const { url } = await this.client.utils.fetch<{ url: string }>('https://api-liart-chi.vercel.app/rule34?search=uzumaki_kushina')
        return void (await reply(await this.client.utils.getBuffer(url), 'image'))
    }
}

import { BaseCommand, Command, Message } from '../../Structures'

@Command('ino', {
    description: 'Sends a random nsfw image',
    category: 'nsfw',
    usage: 'ino',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async ({ reply }: Message): Promise<void> => {
        const { url } = await this.client.utils.fetch<{ url: string }>('https://api-liart-chi.vercel.app/rule34?search=ino_yamanaka')
        return void (await reply(await this.client.utils.getBuffer(url), 'image'))
    }
}

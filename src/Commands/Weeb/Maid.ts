import { BaseCommand, Command, Message } from '../../Structures'

@Command('maid', {
    description: 'Sends a random maid image',
    category: 'weeb',
    usage: 'maid',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async ({ reply }: Message): Promise<void> => {
        const { images } = await this.client.utils.fetch<{
            images: {
                signature: string
                extension: string
                image_id: number
                favorites: string
                dominant_color: string
                source: string
                artist?: string
                uploaded_at: string
                liked_at?: string
                is_nsfw: boolean
                width: number
                height: number
                byte_size: number
                url: string
                preview_url: string
                tags: {
                    tag_id: number
                    name: string
                    description: string
                    is_nsfw: boolean
                }[]
            }[]
        }>('https://api.waifu.im/search/?included_tags=maid')
        return void (await reply(await this.client.utils.getBuffer(images[0].url), 'image'))
    }
}

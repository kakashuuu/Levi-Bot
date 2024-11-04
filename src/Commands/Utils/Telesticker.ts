import Sticker, { StickerTypes } from 'wa-sticker-formatter'
import { BaseCommand, Message, Command } from '../../Structures'

interface ITelestickerResponse {
    name: string
    title: string
    is_animated: boolean
    is_video: boolean
    stickers: string[]
}

@Command('tele-sticker', {
    aliases: ['tl'],
    description: 'Convert telegram stickers into whatsapp Stickers',
    category: 'media',
    usage: 'tele-sticker [url]',
    exp: 10
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        if (!M.urls.length) return void (await M.reply('Telegram sticker Link?'))
        const url = M.urls.find((url) => url.includes('t.me/addstickers'))
        if (!url) return void (await M.reply('No telegram addstickers URLs found in your message'))
        const data: ITelestickerResponse = await this.client.utils.fetch(
            `https://weeb-api.vercel.app/telesticker?url=${url}`
        )
        await M.reply('Sending strickers in your private chat')
        data.stickers.forEach(async (sticker) => {
            await this.client.sendMessage(M.sender.jid, {
                sticker: await new Sticker(sticker, {
                    pack: 'Made For You☑️',
                    author: '❤By Levi.inc❤',
                    type: StickerTypes.FULL,
                    categories: ['😄', '🎉'],
                    quality: 100,
                    background: 'transparent'
                }).build()
            })
        })
    }
}

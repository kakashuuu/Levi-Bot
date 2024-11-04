import { IArgs } from '../../Types'
import { Command, BaseCommand, Message } from '../../Structures'
import { AnyMessageContent, proto, delay } from '@whiskeysockets/baileys'

@Command('broadcast', {
    description: 'broadcasts announcements in groups',
    aliases: ['bc'],
    category: 'dev',
    usage: ''
})
export default class BroadcastCommand extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
            let arr: string[] = []
            let type: 'text' | 'image' | 'video' = 'text'
            let buffer!: Buffer
            if (M.hasSupportedMediaMessage) {
                if (M.type === 'imageMessage') type = 'image'
                if (M.type === 'videoMessage') type = 'video'
                buffer = await M.downloadMediaMessage(M.message.message as proto.IMessage)
            } else if (!M.hasSupportedMediaMessage && M.quoted && M.quoted.hasSupportedMediaMessage) {
                if (M.quoted.type === 'imageMessage') type = 'image'
                if (M.quoted.type === 'videoMessage') type = 'video'
                buffer = await M.downloadMediaMessage(M.quoted.message as proto.IMessage)
            }
            let caption: string
            if ((!context && !M.quoted?.content) || (!context && M.quoted?.content === ''))
                return void M.reply('🟥 *Provide the text to be broadcasted*')
            if (context) caption = context.trim()
            else caption = M.quoted?.content.trim() as string
            if (!arr.length) arr = await this.client.getAllGroups()
            const text = `*🏮 Levi Broadcast 🏮*\n\n*${caption}*\n\n*🪶Author:* *${M.sender.username}*`
            for (const group of arr) {
                await delay(5000)
                await this.client.sendMessage(group, {
                    [type]: type === 'text' ? text : buffer,
                    caption: type === 'text' ? undefined : text,
                    gifPlayback: type === 'video' ? true : undefined
                } as unknown as AnyMessageContent)
            }
            return void M.reply('Done!')
    }
}

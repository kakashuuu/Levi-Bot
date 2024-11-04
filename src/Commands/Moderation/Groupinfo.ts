import { Command, BaseCommand, Message } from '../../Structures'

@Command('groupinfo', {
    description: 'Get Group information',
    usage: 'groupinfo',
    category: 'core',
    exp: 10
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        if (!M.groupMetadata) return void M.reply('*Try Again*')

        const { id, subject, owner, participants, admins, desc, creation } = M.groupMetadata
        const { mods, wild, chara, events } = await this.client.DB.getGroup(M.from)
        let pfpUrl: string | undefined

        try {
            pfpUrl = await this.client.profilePictureUrl(id, 'image')
        } catch {
            pfpUrl = undefined
        }

        const pfp = pfpUrl ? await this.client.utils.getBuffer(pfpUrl) : (this.client.assets.get('404') as Buffer)
        let text = ''
        text += `*📋ID*: ${id}\n\n`
        text += `*🏷️Subject*: ${subject}\n\n`
        text += `*👑Owner*: ${owner ? `@${owner.split('@')[0]}` : 'Unknown'}\n\n`
        text += `*🗓️ Created On*: ${creation ? new Date(creation * 1000).toLocaleString() : 'Unknown'}\n\n`
        text += `*👥Participants*: ${participants.length}\n\n`
        text += `*🎖️Admins*: ${admins?.length ?? 0}\n\n`
        text += `*🌀Mods*: ${mods}\n\n`
        text += `*🟦Wild*: ${wild}\n\n`
        text += `*🃏Chara*: ${chara}\n\n`
        text += `*🍃Events*: ${events}\n\n`
        text += `*ℹ️ Description*: ${desc ?? 'No description available'}`

        return void (await M.reply(pfp, 'image', undefined, undefined, text))
    }
}

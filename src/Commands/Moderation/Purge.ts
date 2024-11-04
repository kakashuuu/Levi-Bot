import { BaseCommand, Command, Message } from '../../Structures'

@Command('purge', {
    description: '',
    category: 'moderation',
    exp: 5,
    cooldown: 5,
    usage: 'purge',
    adminRequired: true
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (!M.groupMetadata) return void M.reply('*Try Again!*')
        const { participants, owner } = M.groupMetadata
        if (M.sender.jid !== owner) return void M.reply('🟥 ONLY the owner of this group can use this command!')
        if (this.purgeSet.has(M.from)) {
            const arr = participants.map((participant) => participant.id)
            if (arr.includes(owner as string)) arr.splice(arr.indexOf(owner as string), 1)
            await this.client
                .groupParticipantsUpdate(M.from, arr, 'remove')
                .then(async () => {
                    M.reply('*🚥Status:*\n\n✅Group purged successfully.')
                    this.purgeSet.delete(M.from)
                    return void (await this.client.groupLeave(M.from))
                })
                .catch(() => {
                    return void M.reply('*Try Again*')
                })
        }
        this.purgeSet.add(M.from)
        M.reply('Are you sure? This will remove everyone from the group chat. Use the command again to proceed.')
        setTimeout(() => {
            if (!this.purgeSet.has(M.from)) return void null
            this.purgeSet.delete(M.from)
        }, 6 * 1000)
    }

    private purgeSet = new Set<string>()
}

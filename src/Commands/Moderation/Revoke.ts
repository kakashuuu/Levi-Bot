import { Command, BaseCommand, Message } from '../../Structures'

@Command('revoke', {
    description: 'revoke',
    usage: 'revoke',
    category: 'moderation',
    exp: 10,
    adminRequired: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        if (!M.groupMetadata) return void M.reply('*Try Again in a group!!*')
        await this.client.groupRevokeInvite(M.from).then(() => {
            M.reply(`🟩 *Done! Group link has been reset*`)
        })
    }
}

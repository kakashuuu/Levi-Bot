import { Command, BaseCommand, Message } from '../../Structures'

@Command('invitelink', {
    description: 'Get Group link',
    usage: 'invitelink',
    category: 'moderation',
    exp: 10,
    adminRequired: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        if (!M.groupMetadata) return void M.reply('*Try Again in a group!!*')
        return void M.reply('https://chat.whatsapp.com/' + (await this.client.groupInviteCode(M.from)))
    }
}

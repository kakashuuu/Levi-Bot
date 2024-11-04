import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('setname', {
    description: 'setname',
    usage: 'setname',
    category: 'moderation',
    exp: 10,
    adminRequired: true
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!M.groupMetadata) return void M.reply('*Try Again in a group!!*')
        if (!context) return void M.reply('No context added to this message')
        await this.client.groupUpdateSubject(M.from, context)
        return void M.reply(`🟩 *Group name set to "${context}"*`)
    }
}

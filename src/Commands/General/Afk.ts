import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('afk', {
    description: 'Make yourself AFK (Away from keyboard)',
    category: 'core',
    usage: 'afk [reason]',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const reason = context ? context.trim() : ''
        await this.client.DB.updateOfflineStatus(M.sender.jid, true, reason)
        return void M.reply(`${M.sender.username} is now Away!`)
    }
}

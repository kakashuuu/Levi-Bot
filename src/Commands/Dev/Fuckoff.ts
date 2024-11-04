import { BaseCommand, Command, Message } from '../../Structures'

@Command('fuckoff', {
    description: 'I am sorry babu',
    category: 'dev',
    aliases: ['fuckoff'],
    usage: 'fuckoff',
    cooldown: 10,
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (!M.groupMetadata) return void M.reply('*Try Again!*')
        const users = M.mentioned
        if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)
        if (!users.length || users.length < 1) return void M.reply('')
        const mentioned = users
        let text = ''
        for (const user of users) {
            const i = users.indexOf(user)
            if (i === 0) text += '\n'
            if (user === M.groupMetadata.owner || '') {
                text += `Skipped @${user.split('@')[0]} as they're the owner.`
                continue
            }
            await this.client.groupParticipantsUpdate(M.from, [user], 'remove')
            text += `*❤⚡I am sorry babu*\n @${user.split('@')[0]}`
        }
        return void M.reply(text, 'text', undefined, undefined, undefined, mentioned)
    }
}

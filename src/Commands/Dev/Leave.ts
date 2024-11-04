import { BaseCommand, Command, Message } from '../../Structures'

@Command('leave', {
    description: 'Make bot to leave the group',
    category: 'dev',
    usage: 'leave',
    exp: 10,
    cooldown: 5
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (!M.groupMetadata) return void M.reply('*Try Again*')
        const participants = M.groupMetadata.participants.map((x) => x.id)
        const comment = [
            'Good-bye Noobs',
            "I'm leaving this Childish group",
            "It's time to leave Goodbye hope u enjoyed my features",
            "I've to go now, everyone",
            '*Sayounara* ❤‍🔥'
        ]
        const text = comment[Math.floor(Math.random() * comment.length)]
        await M.reply(text, 'text', undefined, undefined, undefined, participants)
        await this.client.groupLeave(M.from)
    }
}

import { BaseCommand, Command, Message } from '../../Structures'

@Command('findcard', {
    description: 'Guide',
    category: 'cards',
    aliases: ['findcard'],
    exp: 5,
    cooldown: 5,
    usage: 'hi'
})
export default class command extends BaseCommand {
    override execute = async ({ reply, sender }: Message): Promise<void> =>
        void reply(
            `🎴Note = Find card Command is joined with #coll command\n\n🔰Usage = Use #coll (query) to find cards For Example #coll kakashi`
        )
}

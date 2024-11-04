import { BaseCommand, Command, Message } from '../../Structures'

@Command('hi', {
    description: 'Says hi to the bot',
    category: 'core',
    aliases: ['hello'],
    exp: 5,
    cooldown: 5,
    react: '❤', 
    usage: 'hi'
})
export default class command extends BaseCommand {
    override execute = async ({ reply, sender }: Message): Promise<void> =>
        void reply(`👋🏻 Hi *${sender.username}*, I'm ${this.client.config.name}.`)
}

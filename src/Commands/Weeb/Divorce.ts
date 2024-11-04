import { BaseCommand, Command, Message } from '../../Structures'

@Command('divorce', {
    description: 'Divorce married haigusha',
    cooldown: 45,
    exp: 10,
    category: 'weeb',
    usage: 'divorce'
})
export default class command extends BaseCommand {
    override execute = async ({ sender, reply, message }: Message): Promise<void> => {
        const { haigusha } = await this.client.DB.getUser(sender.jid)
        if (!haigusha.married) return void reply("You aren't married to anyone.")
        return void (await reply(`💔 You divorced *${haigusha.data?.name}*.`))
    }
}

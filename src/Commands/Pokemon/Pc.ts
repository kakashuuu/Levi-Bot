import { Command, BaseCommand, Message } from '../../Structures'

@Command('pc', {
    description: "Displays user's pokemon pc",
    exp: 10,
    category: 'pokemon',
    cooldown: 10,
    usage: 'pc',
    antiBattle: true
})
export default class command extends BaseCommand {
    override execute = async ({ from, sender, message, reply }: Message): Promise<void> => {
        const { pc } = await this.client.DB.getUser(sender.jid)
        if (pc.length < 1) return void reply("You don't have any pokemon in your pc")
        let text = `*💻 ${sender.username} PC*\n\n*🌍Logged In as ${sender.username}*\n`
        pc.forEach((x, y) => (text += `\n*🏮 ${y + 1} - ${this.client.utils.capitalize(x.name)}*`))
        return void (await reply(text, 'text'))
    }
}

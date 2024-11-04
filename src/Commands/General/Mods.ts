import { Command, BaseCommand, Message } from '../../Structures'

@Command('mods', {
    description: 'Disaplays the users which moderates the bot',
    category: 'core',
    cooldown: 15,
    exp: 100,
    usage: 'mods',
    aliases: ['moderators']
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        let text = '*🏮 Levi Mods 🏮*\n'
        this.client.config.mods.forEach((mod) => (text += `\n*👑 @${mod.split('@')[0]}*`))
        const buffer = await this.client.utils.getBuffer('https://i.ibb.co/2MZKDGp/photo-2023-04-25-17-10-32.jpg')
        return void (await M.reply(buffer, 'image', undefined, undefined, text, this.client.config.mods))
    }
}

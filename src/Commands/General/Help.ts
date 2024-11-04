import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('help', {
    description: "Displays the bot's usable commands",
    aliases: ['h'],
    cooldown: 10,
    exp: 20,
    usage: 'help || help <command_name>',
    category: 'core'
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) {
            let commands = Array.from(this.handler.commands, ([command, data]) => ({
                command,
                data
            })).filter((command) => command.data.config.category !== 'dev')
            let text = `⛩️ *❯─「 ${this.client.config.name} 」─❮* ⛩️\n\n*Hello There 🎉* *${M.sender.username}*\n\n🎐𝗧𝗵𝗶𝘀 𝗛𝗲𝗹𝗽 𝗟𝗶𝘀𝘁 𝗶𝘀 𝗗𝗲𝘀𝗶𝗴𝗻𝗲𝗱 𝗙𝗼𝗿 𝘆𝗼𝘂 𝘁𝗼 𝗴𝗲𝘁 𝘀𝘁𝗮𝗿𝘁𝗲𝗱 𝘄𝗶𝘁𝗵 𝗟𝗲𝘃𝗶.𝗶𝗻𝗰🎐\n\n*⟾📫 Commands list📫*`
            const categories: string[] = []
            for (const command of commands) {
                if (categories.includes(command.data.config.category)) continue
                categories.push(command.data.config.category)
            }
            for (const category of categories) {
                const categoryCommands: string[] = []
                const filteredCommands = commands.filter((command) => command.data.config.category === category)
                text += `\n\n*━━━━❰ ${this.client.utils.capitalize(category)}  ❱━━━━*\n\n`
                filteredCommands.forEach((command) => categoryCommands.push(command.data.name))
                text += `\`\`\`❐ ${categoryCommands.join(', ')}\`\`\``
            }
            text += `\n\n📕 *Note: Use #levigclinks to join our official groups for casino and cards stuffs*`
            return void (await M.reply(text, 'text', undefined, undefined, undefined, [M.sender.jid], {
                title: this.client.utils.capitalize('𝗟𝗲𝘃𝗶 𝗕𝗼𝘁𝘇 𝗜𝗻𝗰 𝟮𝟬𝟮𝟰'),
                thumbnail: await this.client.utils.getBuffer('https://telegra.ph/file/9eac5e507f20657f122ea.jpg'),
                mediaType: 1
            }))
        } else {
            const cmd = context.trim().toLowerCase()
            const command = this.handler.commands.get(cmd) || this.handler.aliases.get(cmd)
            if (!command) return void M.reply(`No command found | *"${context.trim()}"*`)
            return void M.reply(
                `🎐 *Command:* ${this.client.utils.capitalize(command.name)}\n🎴 *Aliases:* ${
                    !command.config.aliases
                        ? ''
                        : command.config.aliases.map((alias) => this.client.utils.capitalize(alias)).join(', ')
                }\n🔗 *Category:* ${this.client.utils.capitalize(command.config.category)}\n⏰ *Cooldown:* ${
                    command.config.cooldown ?? 3
                }s\n🎗 *Usage:* ${command.config.usage
                    .split('||')
                    .map((usage) => `${this.client.config.prefix}${usage.trim()}`)
                    .join(' | ')}\n🧧 *Description:* ${command.config.description}`
            )
        }
    }
                }

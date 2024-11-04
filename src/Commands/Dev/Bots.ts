import { BaseCommand, Command, Message } from '../../Structures'
const pm2 = require('pm2')

@Command('bots', {
    aliases: [],
    category: 'dev',
    description: 'Lists all bots',
    usage: 'bots',
    exp: 100
})
export default class extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        pm2.connect(async (err: any) => {
            if (err) {
                console.error(err.message)
                return void M.reply('An error Occurred')
            }
            pm2.list(async (list: any, bots: any[]) => {
                if (list) {
                    console.error(list.message)
                    return void M.reply('Unable to fetch list, Try again!')
                }
                const Text = bots
                    .map(
                        (bot) =>
                            `\n\n🔰 *Name: ${this.client.utils.capitalize(bot.name)}*\n🎡 *Status: ${
                                bot.pm2_env.status ? 'Active 🟩' : 'Inactive 🟥'
                            }*`
                    )
                    .join('')
                pm2.disconnect()
                return void (await M.reply(Text.trim()))
            })
        })
    }
}

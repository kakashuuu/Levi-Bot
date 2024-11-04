import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('clean', {
    description: 'I think delete properties from user',
    category: 'dev',
    dm: true,
    usage: 'clean jid fileid',
    exp: 20,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void M.reply('You YAOI, Baka!')
        const [phone, fileid] = context.trim().split(' ')
        if (!M.numbers.length || !fileid) return void M.reply('You are piece of YAOI, Baka!')
        const jid = phone + '@s.whatsapp.net'
        const valid = (await this.client.onWhatsApp(jid))[0]?.exists || false
        if (!valid) return void M.reply('🟥 User does not exist')
        const user = await this.client.DB.getUser(jid)
        const properties = Object.keys(user.toObject())
        if (properties.includes(fileid)) {
            await this.client.DB.deleteUserProperty(jid, fileid)
            return void M.reply(`✅ Successfully Deleted ${fileid}`)
        } else return void M.reply(`❌ Invalid property, ✅ correct: ${properties.join(', ')}`)
    }
          }

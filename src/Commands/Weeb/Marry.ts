import { BaseCommand, Command, Message } from '../../Structures'
import { Ship } from '@shineiichijo/canvas-chan'
import { AnyMessageContent } from '@whiskeysockets/baileys'

@Command('marry', {
    description: 'Marries the summoned haigusha',
    usage: 'marry',
    cooldown: 45,
    category: 'utils',
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async ({ from, sender, reply, message }: Message): Promise<void> => {
        if (!this.handler.haigushaResponse.has(from)) return void reply(`No haigusha summoned.`)
        
        const { haigusha } = await this.client.DB.getUser(sender.jid)
        if (haigusha.married) {
            return void reply(`You are already married💍`)
        }
        
        const res = this.handler.haigushaResponse.get(from)
        if (!res) return void null
        
        await this.client.DB.user.updateOne(
            { jid: sender.jid },
            { $set: { 'haigusha.married': true, 'haigusha.data': res } }
        )
        
        this.handler.haigushaResponse.delete(from)
        return void reply(`You are now married💍 with ${res.name}`)
    }
}

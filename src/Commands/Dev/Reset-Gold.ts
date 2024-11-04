import { BaseCommand, Command, Message } from '../../Structures'

@Command('addgold', {
    category: 'dev',
    description: 'reset the gold of the @tagged user',
    usage: 'addgold',
    exp: 25,
    cooldown: 0
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const owner = ['923224875937', '919389379221']
        if (!owner.includes(M.sender.jid.split('@')[0])) return void M.reply('*Fuck you🤍✨ Only ᴹᴿ᭄ ᴋᴀᴋᴀsʜɪོ ×፝֟͜× and AliAryanTech Are ✅ Allowed to use this command You ❌ Dont Deserve This Bastard 😂*')
        const users = M.mentioned
        if (M?.sender?.isMod) {
            if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)
            if (!users.length || users.length < 0) return void M.reply('Tag or quote a user to give')
            // if (users[0] === M.sender.jid) return void M.reply('tag someone')
            if (M.numbers.length < 1) return void M.reply(`amount?`)
            const user = users[0]
            const { wallet } = await this.client.DB.getUser(M.sender.jid)
            const amount = M.numbers[0]
            // if ((wallet - amount) < 0) return void M.reply(`Check ur wallet`)
            // await this.client.DB.setMoney(M.sender.jid, -amount)
            await this.client.DB.setMoney(user, amount)
            return void M.reply(`🟩 Successfully *🪙${amount}* into wallet of @${user.split('@')[0]}`, 'text', undefined, undefined, undefined, [
                M.sender.jid,
                user
            ])
        }
    }
}

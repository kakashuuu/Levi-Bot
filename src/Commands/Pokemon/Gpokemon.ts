import { Command, BaseCommand, Message } from '../../Structures'

@Command('pokemon-give', {
    description: 'Give a pokemon to another user',
    aliases: ['pg, pgive'],
    usage: 'pokemon-give [index of the pokemon]',
    category: 'pokemon',
    cooldown: 15,
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const users = M.mentioned
        if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)
        if (!users.length || users.length < 0) return void M.reply('🟥 *You must mention a user to give a pokemon to*')
        if (M.numbers.length < 2) return void M.reply('🟥 *Invalid pokemon index*')
        const { party } = await this.client.DB.getUser(M.sender.jid)
        const { party: targetparty } = await this.client.DB.getUser(M.sender.jid)
        const i = M.numbers[1]
        if (i < 1 || i > party.length) return void M.reply('🟥 *Invalid pokemon index*')
        if (targetparty.length === 12) return void M.reply('🟥 *That user has no room in their party*')
        const data = party[i - 1]
        party.splice(i - 1, 1)
        targetparty.push(data)
        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { party } })
        await this.client.DB.user.updateOne({ jid: users[0] }, { $set: { party: targetparty } })
        return void M.reply(
            `🟩 Gave pokemon *${data.name} - ${data.level}* to @${users[0].split('@')[0]}`,
            'text',
            undefined,
            undefined,
            undefined,
            [M.mentioned[0]]
        )
    }
}

import { BaseCommand, Command, Message } from '../../Structures'

@Command('t2party', {
    category: 'pokemon',
    description: 'Transfers a pokemon in a pc to the party',
    usage: 't2pc <entry_number_of_a_pokemon_in_the_pc>',
    cooldown: 15,
    exp: 35,
    antiBattle: true
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const { pc, party } = await this.client.DB.getUser(M.sender.jid)
        if (pc.length < 1) return void M.reply("You don't have any pokemon in your pc")
        if (M.numbers.length < 2)
            return void M.reply(
                'Provide the entry number of a pokemon in your pc that you wanna transfer to your party'
            )
        if (party.length >= 6) return void M.reply('🟨 *Your party is full*')
        const i = M.numbers[1]
        if (i < 1 || i > pc.length) return void M.reply('Invalid entry number of pokemon in your pc')
        const text = `*${this.client.utils.capitalize(pc[i - 1].name)}* has been transferred to your party`
        party.push(pc[i - 1])
        pc.splice(i - 1, 1)
        await this.client.DB.updateUser(M.sender.jid, 'party', 'set', party)
        await this.client.DB.updateUser(M.sender.jid, 'pc', 'set', pc)
        return void (await M.reply(text, 'text'))
    }
}

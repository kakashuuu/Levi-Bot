import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { Pokemon } from '../../Database'

@Command('catch', {
    description: 'Catches the appeared wild pokemon',
    category: 'pokemon',
    usage: 'catch <pokemon_name>',
    cooldown: 5,
    exp: 25,
    aliases: ['c'],
    react: '😁', 
    antiBattle: true
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!this.handler.pokemonResponse.has(M.from))
            return void M.reply("🟥 *Currently there aren't any wild pokemons to catch.*")
        const data = this.handler.pokemonResponse.get(M.from) as Pokemon
        if (!context) return void M.reply('Provide the name of the pokemon, Baka!')
        const pokemon = context.trim().toLowerCase().split(' ')[0].trim()
        if (pokemon !== data.name) return void M.reply('Wrong Pokemon.')
        this.handler.pokemonResponse.delete(M.from)
        let flag = false
        let { party, pc } = await this.client.DB.getUser(M.sender.jid)
        const Text = `🎉 Congratulations ${M.sender.username}\n\n🔮 You caught a Level ${
            data.level
        } ${this.client.utils.capitalize(data.name)}.\n\n🍁Note = ${
            party.length >= 6 ? 'This Pokemon has been stored to your PC.' : ''
        }`
        const filteredParty = party.filter((x) => x.hp > 0)
        if (party.length >= 1) flag = true
        party.length >= 6 ? pc.push(data) : party.push(data)
        await this.client.DB.updateUser(M.sender.jid, 'pc', 'set', pc)
        await this.client.DB.updateUser(M.sender.jid, 'party', 'set', party)
        await M.reply(Text, 'text')
        if (!flag) return void null
        if (!filteredParty.length) return void null
        const index = party.findIndex((x) => x.tag === filteredParty[0].tag)
        const pkmn = party[index]
        if (pkmn.level >= 100) return void null
        const resultExp = Math.round(data.exp / 8)
        pkmn.exp += resultExp
        pkmn.displayExp += resultExp
        const pokemonLevelCharts = await this.client.utils.fetch<{ level: number; expRequired: number }[]>(
            'https://raw.githubusercontent.com/Levi-new-2024/smart-enhancer/main/envv'
        )
        const levels = pokemonLevelCharts.filter((x) => pkmn.exp >= x.expRequired)
        if (pkmn.level < levels[levels.length - 1].level) {
            pkmn.level = levels[levels.length - 1].level
            pkmn.displayExp = pkmn.exp - levels[levels.length - 1].expRequired
            this.client.emit('pokemon_levelled_up', {
                M,
                pokemon: pkmn,
                inBattle: false,
                player: 'player1',
                user: M.sender.jid
            })
        }
        await this.client.DB.updateUser(M.sender.jid, 'party', 'set', party)
    }
}
